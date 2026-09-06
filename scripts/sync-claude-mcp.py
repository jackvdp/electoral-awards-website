#!/usr/bin/env python3
"""Preview and confirm missing MCP imports between Claude and Codex."""
import argparse
from datetime import date
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

try:
    import tomllib
except ImportError:
    # macOS's bundled Python is too old; prefer an installed modern interpreter.
    candidate = Path('/opt/homebrew/bin/python3')
    if candidate.exists() and candidate.resolve() != Path(sys.executable).resolve():
        os.execv(str(candidate), [str(candidate), *sys.argv])
    sys.exit('Python 3.11+ is required. Run this script with a newer Python interpreter.')

VARIABLE = re.compile(r'\$\{([A-Za-z_][A-Za-z0-9_]*)(?::-([^}]*))?\}')
NAME = re.compile(r'^[A-Za-z0-9_-]+$')


class ReviewError(Exception):
    pass


def paint(text, code):
    if sys.stdout.isatty() and 'NO_COLOR' not in os.environ and os.environ.get('TERM') != 'dumb':
        return f'\033[{code}m{text}\033[0m'
    return text


def short(path):
    return str(path).replace(str(Path.home()) + '/', '~/')


def read(path):
    if path.is_symlink():
        raise ReviewError(f'Resolve the config symlink manually first: {short(path)}')
    return path.read_bytes() if path.exists() else b''


def parse(path, content, toml=False):
    try:
        value = (tomllib.loads(content.decode()) if toml else json.loads(content)) if content else {}
        if not isinstance(value, dict):
            raise ValueError()
        return value
    except (ValueError, UnicodeError):
        # Parser exception messages can include credentials from the source.
        raise ReviewError(f'Invalid {"TOML" if toml else "JSON"}: {short(path)}') from None


def expand(value, environment):
    if not isinstance(value, str):
        raise ReviewError('Expected a string setting')
    def replace(match):
        name, default = match.groups()
        if name in environment:
            return environment[name]
        if default is not None:
            return default
        raise ReviewError(f'Missing environment variable: {name}')
    result = VARIABLE.sub(replace, value)
    if '${' in result:
        raise ReviewError('Unsupported environment placeholder')
    return result


def convert(server, root, environment):
    if not isinstance(server, dict):
        raise ReviewError('Server definition is not an object')
    kind = server.get('type', 'stdio')
    allowed = {'type', 'command', 'args', 'env', 'cwd'} if kind == 'stdio' else {'type', 'url', 'headers'}
    if set(server) - allowed:
        raise ReviewError('Contains settings requiring manual conversion (for example OAuth or dynamic headers)')
    if kind == 'stdio':
        if not server.get('command'):
            raise ReviewError('Missing command')
        args, env = server.get('args', []), server.get('env', {})
        if not isinstance(args, list) or not isinstance(env, dict):
            raise ReviewError('Invalid args or env')
        cwd = Path(expand(server.get('cwd', str(root)), environment))
        if not cwd.is_absolute():
            cwd = root / cwd
        result = {'command': expand(server['command'], environment),
                  'args': [expand(a, environment) for a in args], 'cwd': str(cwd)}
        if env:
            result['env'] = {k: expand(v, environment) for k, v in env.items()}
        return result
    if kind != 'http':
        raise ReviewError('Only stdio and HTTP are supported; SSE needs manual migration')
    if not server.get('url'):
        raise ReviewError('Missing URL')
    result = {'url': expand(server['url'], environment)}
    if not result['url'].startswith(('http://', 'https://')):
        raise ReviewError('Invalid HTTP URL')
    headers = server.get('headers', {})
    if not isinstance(headers, dict):
        raise ReviewError('Invalid headers')
    for name, value in headers.items():
        if not isinstance(value, str):
            raise ReviewError('Invalid header value')
        match = re.fullmatch(r'Bearer \$\{([A-Za-z_][A-Za-z0-9_]*)\}', value)
        if name.lower() == 'authorization' and match:
            result['bearer_token_env_var'] = match[1]
        elif re.fullmatch(r'\$\{([A-Za-z_][A-Za-z0-9_]*)\}', value):
            result.setdefault('env_http_headers', {})[name] = value[2:-1]
        else:
            result.setdefault('http_headers', {})[name] = expand(value, environment)
    return result


def to_claude(server, root, target):
    """Convert only settings whose behaviour can be preserved in Claude."""
    if not isinstance(server, dict):
        raise ReviewError('Server definition is not an object')
    stdio = 'command' in server
    allowed = ({'command', 'args', 'env', 'cwd'} if stdio else
               {'url', 'http_headers', 'env_http_headers', 'bearer_token_env_var'}) | {'enabled'}
    if set(server) - allowed:
        raise ReviewError('Codex-specific settings need manual conversion (tool restrictions, OAuth, timeouts or environment forwarding)')
    if 'enabled' in server and not isinstance(server['enabled'], bool):
        raise ReviewError('Invalid enabled setting')
    def literal(value):
        if not isinstance(value, str) or '${' in value:
            raise ReviewError('Non-string or literal environment placeholder needs manual conversion')
        return value
    def variable(value):
        if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', value):
            raise ReviewError('Invalid environment variable name')
        return '${' + value + '}'
    if stdio:
        cwd = server.get('cwd')
        # Claude has no documented cwd field. Project-local imports may use the
        # same project directory; never silently discard a custom working path.
        if cwd is not None and (target == 'user' or Path(literal(cwd)) != root):
            raise ReviewError('Custom working directory requires a Claude launcher; configure manually')
        args, env = server.get('args', []), server.get('env', {})
        if not isinstance(args, list) or not isinstance(env, dict):
            raise ReviewError('Invalid args or env')
        result = {'type': 'stdio', 'command': literal(server['command']),
                  'args': [literal(v) for v in args]}
        if not result['command']:
            raise ReviewError('Missing command')
        if env:
            result['env'] = {k: literal(v) for k, v in env.items()}
        return result
    url = literal(server.get('url'))
    if not url.startswith(('https://', 'http://')):
        raise ReviewError('Invalid HTTP URL')
    result = {'type': 'http', 'url': url}
    headers = {}
    def header(name, value):
        if not isinstance(name, str) or name.lower() in {k.lower() for k in headers}:
            raise ReviewError('Conflicting HTTP header settings require manual review')
        headers[name] = value
    for field in ('http_headers', 'env_http_headers'):
        values = server.get(field, {})
        if not isinstance(values, dict):
            raise ReviewError('Invalid headers')
        for name, value in values.items():
            header(name, variable(value) if field == 'env_http_headers' else literal(value))
    if 'bearer_token_env_var' in server:
        header('Authorization', 'Bearer ' + variable(server['bearer_token_env_var']))
    if headers:
        result['headers'] = headers
    return result


def entries(config):
    result = config.get('mcpServers', {})
    if not isinstance(result, dict):
        raise ReviewError('mcpServers must be an object')
    return result


def discover(root, config, project, disabled):
    projects = config.get('projects', {})
    local = {}
    for name, value in projects.items():
        if Path(name).resolve() == root:
            local = entries(value)
            break
    scopes = [('user', entries(config)), ('project', entries(project)), ('local', local)]
    found = {}
    for scope, servers in scopes:
        for name, server in servers.items():
            old = found.get(name)
            found[name] = {'name': name, 'scope': scope, 'server': server,
                           'shadowed': (old['shadowed'] + [old['scope']]) if old else [],
                           'disabled': name in disabled}
    return [found[n] for n in sorted(found)]


def toml_value(value):
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return '[' + ', '.join(toml_value(v) for v in value) + ']'
    if isinstance(value, dict):
        return '{ ' + ', '.join(f'{toml_value(k)} = {toml_value(v)}' for k, v in value.items()) + ' }'
    raise ReviewError('Unsupported TOML value')


def render(original, additions):
    text = original.decode()
    for name, config in additions:
        text += '\n\n' + f'[mcp_servers.{toml_value(name)}]\n'
        text += ''.join(f'{key} = {toml_value(value)}\n' for key, value in config.items())
    try:
        tomllib.loads(text)
    except ValueError:
        raise ReviewError('Cannot append MCP tables to this TOML layout; no config was changed') from None
    return text.encode()


def atomic_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(prefix='.' + path.name + '-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(data)
        os.replace(temp, path)  # mkstemp creates the file with mode 0600.
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def git(root, *args):
    return subprocess.run(['git', '-C', str(root), *args], text=True, capture_output=True)


IGNORE_HEADER = ('# MCP servers that scripts/sync-claude-mcp.py should neither offer to import\n'
                 '# nor flag for review. One server name per line; # starts a comment.\n')


def load_ignored(path):
    """Server names listed in the ignore file (missing file means none)."""
    if not path.exists():
        return set()
    names = set()
    for line in path.read_text().splitlines():
        line = line.split('#', 1)[0].strip()
        if line:
            names.add(line)
    return names


def record_ignored(path, names, label):
    """Append names to the ignore file, creating it with a short header if needed."""
    existing = path.read_text() if path.exists() else ''
    text = '' if existing else IGNORE_HEADER
    if existing and not existing.endswith('\n'):
        text += '\n'
    text += f'\n# {label}\n' + ''.join(f'{name}\n' for name in names)
    with path.open('a') as stream:
        stream.write(text)


class Prompter:
    """Ask questions on the terminal; in hook mode use /dev/tty so Git's stdin is never read."""

    def __init__(self, pre_push):
        self.pre_push = pre_push
        self.terminal = None

    def open(self):
        if self.pre_push:
            # Git owns stdin: ref updates must never be treated as confirmation.
            self.terminal = open('/dev/tty', 'r+')

    def ask(self, prompt):
        try:
            if self.terminal is not None:
                self.terminal.write(prompt)
                self.terminal.flush()
                return self.terminal.readline().strip().lower()
            return input(prompt).strip().lower()
        except (EOFError, KeyboardInterrupt):
            return ''

    def close(self):
        if self.terminal is not None:
            self.terminal.close()
            self.terminal = None


def choose(args, ignore_path, direction, additions, review):
    """Ask about each server in turn: import it, ignore it from now on, or leave it.

    Returns (additions to import, count left unresolved), or None when no terminal is available.
    """
    recipient = 'Claude' if direction == 'to-claude' else 'Codex'
    prompter = Prompter(args.pre_push)
    try:
        prompter.open()
    except OSError:
        print('\nCannot prompt here. Run python3 scripts/sync-claude-mcp.py in a terminal, then retry the push.')
        return None
    chosen, ignored, remaining = [], [], 0
    try:
        for name, converted in additions:
            answer = prompter.ask(paint(f'\nAdd {name!r} to {recipient}? [y]es / [i]gnore from now on / [N]o ', '1'))
            if answer in {'y', 'yes'}:
                chosen.append((name, converted))
            elif answer in {'i', 'ignore'}:
                ignored.append(name)
            else:
                remaining += 1
        for name, reason in review:
            answer = prompter.ask(paint(f'\nIgnore {name!r} from now on? ({reason}) [y/N] ', '1'))
            if answer in {'y', 'yes'}:
                ignored.append(name)
            else:
                remaining += 1
    finally:
        prompter.close()
    if ignored:
        label = f'Ignored {date.today():%-d %B %Y} ({"Codex → Claude" if direction == "to-claude" else "Claude → Codex"})'
        record_ignored(ignore_path, ignored, label)
        print(paint(f'\nIgnoring {", ".join(repr(n) for n in ignored)} from now on; '
                    f'listed in {short(ignore_path)}. Delete the line to reconsider.', '32'))
    if not chosen:
        print(f'\n{remaining} left for another time; no config changed.' if remaining else
              '\nNo config changed.')
    return chosen, remaining


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--project', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--claude-config', type=Path, default=Path.home() / '.claude.json')
    parser.add_argument('--direction', choices=['both', 'to-codex', 'to-claude'], default='both')
    parser.add_argument('--target', choices=['project', 'user'], default='project')
    parser.add_argument('--check', action='store_true', help='Preview only; exit 1 when additions or review items exist')
    parser.add_argument('--pre-push', action='store_true',
                        help='Prompt via the terminal, then stop the push after imports for review')
    parser.add_argument('--ignore-file', type=Path,
                        help='Server names to leave alone, one per line (default: <project>/.mcp-sync-ignore)')
    args = parser.parse_args()
    directions = ['to-codex', 'to-claude'] if args.direction == 'both' else [args.direction]
    results = [sync_direction(args, direction) for direction in directions]
    return max(results)


def sync_direction(args, direction):
    reverse = direction == 'to-claude'
    recipient = 'Claude' if reverse else 'Codex'
    root = args.project.resolve()
    if not root.is_dir():
        raise ReviewError('Project directory does not exist')
    codex_home = Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))).expanduser()
    global_path, project_path = codex_home / 'config.toml', root / '.codex/config.toml'
    destination = (args.claude_config.expanduser() if reverse else
                   project_path if args.target == 'project' else global_path)
    sources = [args.claude_config.expanduser(), root / '.mcp.json',
               Path.home() / '.claude/settings.json', root / '.claude/settings.json',
               root / '.claude/settings.local.json', global_path, project_path]
    snapshots = {p: read(p) for p in sources}
    configs = {p: parse(p, data, p in (global_path, project_path)) for p, data in snapshots.items()}
    disabled_project = set()
    for p in sources[2:5]:
        disabled_project.update(configs[p].get('disabledMcpjsonServers', []))
    disabled = set()
    for project_name, settings in configs[sources[0]].get('projects', {}).items():
        if Path(project_name).resolve() == root:
            disabled.update(settings.get('disabledMcpServers', []))
    servers = discover(root, configs[sources[0]], configs[sources[1]], disabled)
    for item in servers:
        if item['scope'] == 'project' and item['name'] in disabled_project:
            item['disabled'] = True
    user_servers = configs[global_path].get('mcp_servers', {})
    repo_servers = configs[project_path].get('mcp_servers', {})
    existing = {**user_servers, **repo_servers}
    claude_names = {item['name'] for item in servers}
    if reverse:
        servers = [{'name': name, 'server': server,
                    'scope': 'project' if name in repo_servers else 'user',
                    'shadowed': [], 'disabled': isinstance(server, dict) and server.get('enabled') is False}
                   for name, server in sorted(existing.items()) if name not in claude_names]
    ignore_path = (args.ignore_file.expanduser() if args.ignore_file else root / '.mcp-sync-ignore')
    ignored_names = load_ignored(ignore_path)
    print(paint('\nCodex MCPs → Claude' if reverse else '\nClaude MCPs → Codex', '1'))
    print(f'  Project:     {short(root)}\n  Destination: {short(destination)} ({args.target} scope)')
    print(f'  Ignore list: {short(ignore_path)} ({len(ignored_names)} listed)')
    print('  Saved definitions only; connections and OAuth logins are not tested.')
    print('  Plugin, managed-policy, CLI-only and claude.ai connections are outside this scan.')
    print('  Credential values, URL paths and launch arguments are hidden.\n')
    additions, review, skipped = [], [], 0
    for number, item in enumerate(servers, 1):
        name, server = item['name'], item['server']
        print(paint(f'  {number}. {name!r} [{item["scope"]}]', '1;36'))
        if name in ignored_names:
            skipped += 1
            print(f'     IGNORE: listed in {short(ignore_path)}\n')
            continue
        source = ((project_path if item['scope'] == 'project' else global_path) if reverse else
                  sources[1] if item['scope'] == 'project' else sources[0])
        print(f'     Source: {short(source)}')
        if item['shadowed']:
            print('     Overrides: ' + ', '.join(item['shadowed']))
        transport = (('http' if 'url' in server else 'stdio') if reverse else
                     server.get('type', 'stdio')) if isinstance(server, dict) else 'invalid'
        print('     Transport: ' + repr(transport))
        if item['disabled'] and (args.pre_push or reverse):
            print('     SKIP: disabled in source settings\n')
            continue
        try:
            if not NAME.fullmatch(name):
                raise ReviewError('Server name needs manual normalisation for Codex')
            if item['disabled']:
                raise ReviewError('Disabled in Claude settings; not offered for import')
            if reverse and name in disabled | disabled_project:
                raise ReviewError('Disabled in Claude settings; not offered for import')
            converted = to_claude(server, root, args.target) if reverse else convert(server, root, os.environ)
            if not reverse and name in existing:
                comparison = dict(existing[name])
                if 'command' in comparison:
                    comparison.setdefault('args', [])
                    comparison.setdefault('cwd', str(root))
                same = all(comparison.get(k) == v for k, v in converted.items())
                status = 'Already configured' if same else 'Already configured; settings differ'
                if existing[name].get('enabled') is False:
                    status += '; disabled in Codex'
                location = project_path if name in repo_servers else global_path
                print(paint(f'     KEEP: {status} in {short(location)}', '33'))
                if args.target == 'user' and name in repo_servers and name not in user_servers:
                    print('     Available only in this project; global import needs manual review.')
                if not same or existing[name].get('enabled') is False:
                    review.append((name, status))
            else:
                additions.append((name, converted))
                print(paint(f'     ADD: missing from {recipient}', '32'))
                if converted.get('env_http_headers') or converted.get('bearer_token_env_var'):
                    print(f'     Auth: environment references retained; {recipient} needs those variables at launch.')
                elif converted.get('http_headers'):
                    print('     Auth: configured headers copied privately (values hidden).')
                elif 'url' in converted:
                    print(f'     Auth: separate {recipient} login may be needed.')
                if 'command' in converted:
                    print('     Launch: command, arguments and environment copied; project working directory retained.')
        except ReviewError as exc:
            review.append((name, str(exc)))
            print(paint(f'     REVIEW: {exc}', '33'))
        print()
    if not servers:
        print('No missing Codex servers to import into Claude.' if reverse else
              'No saved Claude MCP definitions found in these scopes.')
    print(paint(f'{len(additions)} to add · {len(review)} to review · {skipped} ignored'
                ' · existing entries will not be replaced', '1'))
    if not additions and not review:
        return 0
    if not additions:
        if args.check:
            return 1
        outcome = choose(args, ignore_path, direction, [], review)
        return 1 if outcome is None else int(bool(outcome[1]))
    original = snapshots[destination]
    backup = destination.with_name(destination.name + '.before-mcp-sync')
    i = 1
    while os.path.lexists(backup):
        backup = destination.with_name(destination.name + f'.before-mcp-sync.{i}')
        i += 1
    exclude = None
    exclude_before = b''
    if args.target == 'project' and not reverse:
        repo = git(root, 'rev-parse', '--show-toplevel')
        if repo.returncode or Path(repo.stdout.strip()).resolve() != root:
            raise ReviewError('--project must be a Git repository root so private config can be excluded correctly')
        tracked = git(root, 'ls-files', '--', '.codex/config.toml', '.codex/config.toml.*')
        if tracked.stdout.strip():
            raise ReviewError('Codex config or backups are tracked by Git; refusing to copy private settings into them')
        result = git(root, 'rev-parse', '--path-format=absolute', '--git-path', 'info/exclude')
        if result.returncode:
            raise ReviewError('Cannot locate Git local exclusions')
        exclude = Path(result.stdout.strip())
        exclude_before = read(exclude)
        print(f'  EXCLUDE .codex/config.toml and backups via {short(exclude)}')
    print(f'  {"UPDATE" if original else "CREATE"} {short(destination)} (owner-only permissions)')
    if original:
        print(f'  BACK UP {short(destination)} → {short(backup)} (owner-only permissions)')
    print('  Private credentials may be copied into the destination. OAuth sessions are not copied.')
    if reverse and args.target == 'project':
        print('  Claude destination: private local scope for this project inside .claude.json.')
    if args.target == 'user':
        print(paint(f'  These servers will be available across {recipient} projects.', '33'))
    if args.check:
        print('\nPreview only; no files changed.')
        return 1
    outcome = choose(args, ignore_path, direction, additions, review)
    if outcome is None:
        return 1
    additions, remaining = outcome
    if not additions:
        return int(bool(remaining))
    if reverse:
        updated = json.loads(json.dumps(configs[destination]))
        section = updated
        if args.target == 'project':
            projects = updated.setdefault('projects', {})
            key = next((key for key in projects if Path(key).resolve() == root), str(root))
            section = projects.setdefault(key, {})
        section.setdefault('mcpServers', {}).update(dict(additions))
        output = (json.dumps(updated, indent=2, ensure_ascii=False) + '\n').encode()
    else:
        output = render(original, additions)
    if any(read(p) != data for p, data in snapshots.items()) or os.path.lexists(backup):
        raise ReviewError('Configuration changed during review; rerun for a fresh preview')
    if exclude:
        if read(exclude) != exclude_before:
            raise ReviewError('Git exclusions changed during review; rerun')
        with exclude.open('ab') as stream:
            stream.write(b'\n# Local Codex MCP configuration and credential backups\n/.codex/config.toml\n/.codex/config.toml.*\n')
    if original:
        with backup.open('xb') as stream:
            os.chmod(backup, 0o600)
            stream.write(original)
    atomic_write(destination, output)
    print(paint(f'\nAdded {len(additions)} servers to {short(destination)}.', '32'))
    print(f'Restart {recipient}, then check /mcp and authenticate separately if needed.')
    if args.pre_push:
        print('\nServers imported. Push stopped so you can review the local configuration, then push again.')
        return 1
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except ReviewError as exc:
        print(f'\nStopped: {exc}', file=sys.stderr)
        sys.exit(1)
    except (OSError, TypeError, AttributeError):
        print('\nStopped: cannot read/write configuration, or its structure is unsupported. No credential details printed.', file=sys.stderr)
        sys.exit(1)
