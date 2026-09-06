#!/usr/bin/env python3
"""Preview and confirm shared personal instructions and skills for Claude and Codex."""
import argparse
import hashlib
import os
from pathlib import Path
import sys


class ReviewError(Exception):
    pass


def colour(text, code):
    if sys.stdout.isatty() and 'NO_COLOR' not in os.environ and os.environ.get('TERM') != 'dumb':
        return f'\033[{code}m{text}\033[0m'
    return text


def short_path(path, home):
    if path == home:
        return '~'
    try:
        return '~/' + str(path.relative_to(home))
    except ValueError:
        return str(path)


def describe(plan, home, number):
    kind, claude, codex, backup = plan
    print(colour(f'  {number}. {short_path(claude, home)}', '1;36'))
    if kind == 'reverse':
        print(colour(f'     Remove   {short_path(claude, home)} (reverse symlink)', '33'))
    if kind in {'promote', 'reverse'}:
        print(colour(f'     Move     {short_path(codex, home)} -> {short_path(claude, home)}', '33'))
    if backup:
        print(colour(f'     Back up  {short_path(codex, home)} -> {short_path(backup, home)}', '33'))
    print(colour(f'     Link     {short_path(codex, home)} -> {short_path(claude, home)}', '32'))
    print()


def exists(path):
    return os.path.lexists(path)


def fingerprint(path):
    """Include contents, link targets and directory membership without following links."""
    if not exists(path):
        return None
    stat = path.lstat()
    meta = (stat.st_ino, stat.st_mode, stat.st_mtime_ns)
    if path.is_symlink():
        return meta, os.readlink(path)
    if path.is_file():
        return meta, hashlib.sha256(path.read_bytes()).hexdigest()
    if path.is_dir():
        return meta, tuple((p.name, fingerprint(p)) for p in sorted(path.iterdir()))
    raise ReviewError(f'Unsupported file type: {path}')


def backup_path(path):
    if path.parent.name == 'skills':
        # Keep SKILL.md backups outside the directory that Codex scans.
        path = path.parent.parent / 'skills-before-home-sync' / path.name
    backup = path.with_name(path.name + '.before-home-sync')
    number = 1
    while exists(backup):
        backup = path.with_name(path.name + f'.before-home-sync.{number}')
        number += 1
    return backup


def contents(path):
    if path.is_symlink():
        return ('link', os.readlink(path))
    if path.is_file():
        return ('file', path.read_bytes(), path.stat().st_mode & 0o777)
    if path.is_dir():
        return ('dir', tuple((p.name, contents(p)) for p in sorted(path.iterdir())))
    raise ReviewError(f'Unsupported file type: {path}')


def plan_pair(claude, codex, plans, problems, skills=False):
    c, a = exists(claude), exists(codex)
    if not c and not a:
        return
    # A correct link is already shared. Never follow arbitrary external links.
    if c and codex.is_symlink() and not claude.is_symlink() and codex.resolve() == claude.resolve():
        return
    if a and claude.is_symlink() and not codex.is_symlink() and claude.resolve() == codex.resolve():
        plans.append(('reverse', claude, codex, None))
        return
    if claude.is_symlink() or codex.is_symlink():
        problems.append(f'Existing external or broken link needs review: {claude} / {codex}')
        return
    if c and a:
        if skills and claude.is_dir() and codex.is_dir():
            for name in sorted({p.name for p in claude.iterdir()} | {p.name for p in codex.iterdir()}):
                if name.startswith('.') or '.before-home-sync' in name:
                    continue
                plan_pair(claude / name, codex / name, plans, problems)
        elif contents(claude) == contents(codex):
            plans.append(('backup-link', claude, codex, backup_path(codex)))
        else:
            problems.append(f'Both locations contain separate content; merge manually: {claude} / {codex}')
    elif c:
        plans.append(('link', claude, codex, None))
    else:
        plans.append(('promote', claude, codex, None))


def scan(home, codex_home):
    plans, problems = [], []
    # Restrict this scan to known personal paths, never recurse over the home directory.
    pairs = [(home / '.claude/CLAUDE.md', codex_home / 'AGENTS.md', False),
             (home / 'CLAUDE.md', home / 'AGENTS.md', False),
             (home / '.claude/skills', home / '.agents/skills', True)]
    for claude, codex, skills in pairs:
        if any(exists(p) and not (p.is_dir() if skills else p.is_file())
               and not p.is_symlink() for p in (claude, codex)):
            problems.append(f'Unexpected path type: {claude} / {codex}')
            continue
        for parent in (claude.parent, codex.parent):
            if any(p.is_symlink() for p in [parent, *parent.parents] if p != home):
                problems.append(f'Symlinked parent needs manual review: {parent}')
                break
        else:
            plan_pair(claude, codex, plans, problems, skills)
    if exists(codex_home / 'AGENTS.override.md'):
        problems.append(f'{codex_home / "AGENTS.override.md"} takes precedence over AGENTS.md; review manually')
    for plan in plans[:]:
        kind, _, source, _ = plan
        if kind in {'promote', 'reverse'} and source.is_dir():
            # Moving relative links to external resources would change their targets.
            for folder, dirs, files in os.walk(source, followlinks=False):
                for name in dirs + files:
                    link = Path(folder) / name
                    if link.is_symlink() and not os.path.isabs(os.readlink(link)):
                        try:
                            link.resolve().relative_to(source.resolve())
                        except ValueError:
                            problems.append(f'Relative link would change target when moved: {link}')
                            if plan in plans:
                                plans.remove(plan)
    return plans, problems


def snapshot(plans):
    return [(str(p), str(p.parent.resolve()), fingerprint(p))
            for _, c, a, backup in plans for p in (c, a, backup) if p is not None]


def apply(plan):
    kind, claude, codex, backup = plan
    claude.parent.mkdir(parents=True, exist_ok=True)
    codex.parent.mkdir(parents=True, exist_ok=True)
    old_link = os.readlink(claude) if kind == 'reverse' else None
    if kind == 'reverse':
        claude.unlink()
    if kind in {'promote', 'reverse'}:
        try:
            codex.rename(claude)
        except OSError:
            if old_link is not None:
                claude.symlink_to(old_link)
            raise
    elif kind == 'backup-link':
        backup.parent.mkdir(parents=True, exist_ok=True)
        codex.rename(backup)
    try:
        codex.symlink_to(os.path.relpath(claude, codex.parent))
    except OSError:
        if kind in {'promote', 'reverse'}:
            claude.rename(codex)
            if old_link is not None:
                claude.symlink_to(old_link)
        elif backup is not None:
            backup.rename(codex)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--home', type=Path, default=Path.home(), help='Home to inspect (also useful for isolated tests)')
    parser.add_argument('--codex-home', type=Path, help='Override the Codex instruction directory')
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--pre-push', action='store_true')
    args = parser.parse_args()
    home = args.home.expanduser().resolve()
    codex_home = (args.codex_home or (Path(os.environ.get('CODEX_HOME', str(home / '.codex')))
                  if home == Path.home().resolve() else home / '.codex')).expanduser().absolute()
    if not home.is_dir():
        raise ReviewError('Home directory does not exist')
    plans, problems = scan(home, codex_home)
    print(colour('\nPersonal agent instruction and skill links', '1'))
    print(f'  Home: {short_path(home, home)}')
    print(colour('  Checks personal instructions and skills; skips system skills and plugin caches.', '2'))
    print()
    if problems:
        print(colour(f'Manual review needed ({len(problems)})', '1;33'))
        for problem in problems:
            print('  ! ' + problem.replace(str(home) + '/', '~/'))
        print()
    if not plans:
        print(colour('No automatic fixes needed.', '32' if not problems else '33'))
        return int(bool(problems))
    print(colour(f'Proposed changes ({len(plans)} location{"s" if len(plans) != 1 else ""})\n', '1'))
    for number, plan in enumerate(plans, 1):
        describe(plan, home, number)
    backups = sum(plan[3] is not None for plan in plans)
    summary = f'{len(plans)} symlink{"s" if len(plans) != 1 else ""} to create'
    if backups:
        summary += f' · {backups} existing item(s) to back up'
    print(colour(summary, '1'))
    print('Existing contents will be preserved. Nothing will be staged or committed.')
    before = snapshot(plans)
    if args.check:
        print(colour('\nPreview only; no changes made.', '2'))
        return 1
    try:
        prompt = colour('\nApply these changes? [y/N] ', '1')
        if args.pre_push:
            try:
                with open('/dev/tty', 'r+') as terminal:
                    terminal.write(prompt)
                    terminal.flush()
                    answer = terminal.readline().strip().lower()
            except OSError:
                print('\nCannot prompt here. Run python3 scripts/sync-home-agent-config.py in a terminal, then retry the push.')
                return 1
        else:
            answer = input(prompt).strip().lower()
    except (EOFError, KeyboardInterrupt):
        print('\nCancelled; no changes made.')
        return 1
    if answer not in {'y', 'yes'}:
        print('Cancelled; no changes made.')
        return 1
    if scan(home, codex_home) != (plans, problems) or snapshot(plans) != before:
        raise ReviewError('Files changed during review; rerun for a fresh preview')
    for plan in plans:
        apply(plan)
        print(colour(f'  Fixed {short_path(plan[2], home)}', '32'))
    print('\nPersonal links updated. Restart Claude and Codex to reload them.')
    if args.pre_push:
        print('\nPush stopped so you can review the changes, then push again.')
        return 1
    return int(bool(problems))


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ReviewError, OSError, RuntimeError) as exc:
        print(f'Stopped: {exc}. Any earlier changes remain; rerun to inspect.', file=sys.stderr)
        sys.exit(1)
