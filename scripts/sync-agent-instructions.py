#!/usr/bin/env python3
"""Preview and, after confirmation, pair Claude instructions with AGENTS.md links."""
import argparse
import os
from pathlib import Path
import sys

# Scan private/ignored project folders too, but avoid generated dependency trees.
SKIP = {'.git', 'node_modules', '.next', '.venv', 'venv', '__pycache__'}


def scan(root):
    plans, problems, seen = [], [], set()

    def error(exc):
        problems.append(str(exc))

    for folder, dirs, files in os.walk(root, followlinks=True, onerror=error):
        directory = Path(folder)
        try:
            stat = directory.stat()
            identity = (stat.st_dev, stat.st_ino)
            if identity in seen:
                dirs[:] = []
                continue
            seen.add(identity)
            dirs[:] = sorted(d for d in dirs if d not in SKIP)
            names = sorted(n for n in files + dirs if n.lower() in {'claude.md', 'agents.md'})
            if not names:
                continue
            claudes = [directory / n for n in names if n.lower() == 'claude.md']
            agents = [directory / n for n in names if n.lower() == 'agents.md']
            if len(claudes) > 1 or len(agents) > 1:
                problems.append(f'{directory}: multiple case variants; resolve manually')
                continue
            c = claudes[0] if claudes else directory / 'CLAUDE.md'
            a = agents[0] if agents else directory / 'AGENTS.md'
            if agents and a.name != 'AGENTS.md':
                problems.append(f'{a}: rename to uppercase AGENTS.md manually')
                continue
            for p in claudes + agents:
                if not p.is_file():
                    raise ValueError(f'{p}: not a readable file (possibly a broken link)')
            if claudes and agents and a.is_symlink() and not c.is_symlink() and a.resolve() == c.resolve():
                continue
            if claudes and c.is_symlink():
                # A reverse pair is usable, but normalise to the requested Claude source.
                if agents and not a.is_symlink() and c.resolve() == a.resolve():
                    plans.append(('reverse', c, a, None))
                else:
                    problems.append(f'{c}: source is a symlink outside a simple reverse pair; resolve manually')
                continue
            if not claudes:
                if a.is_symlink():
                    problems.append(f'{a}: cannot promote a symlink to the Claude source; resolve manually')
                else:
                    plans.append(('promote', c, a, None))
            elif not agents:
                plans.append(('link', c, a, None))
            else:
                backup = a.with_name(a.name + '.before-symlink')
                suffix = 1
                while os.path.lexists(backup):
                    backup = a.with_name(f'{a.name}.before-symlink.{suffix}')
                    suffix += 1
                plans.append(('replace', c, a, backup))
        except (OSError, ValueError, RuntimeError) as exc:
            problems.append(str(exc))
    return plans, problems


def colour(text, code):
    if sys.stdout.isatty() and 'NO_COLOR' not in os.environ and os.environ.get('TERM') != 'dumb':
        return f'\033[{code}m{text}\033[0m'
    return text


def short_path(path, root=None):
    if root is not None:
        try:
            return str(path.relative_to(root))
        except ValueError:
            pass
    try:
        return '~/' + str(path.relative_to(Path.home()))
    except ValueError:
        return str(path)


def describe(plan, root, number):
    kind, c, a, backup = plan
    print(colour(f'  {number}. {short_path(c.parent, root)}', '1;36'))
    if c.parent != c.parent.resolve():
        print(colour(f'     Location: {short_path(c.parent.resolve())}', '2'))
    if kind == 'replace':
        print(colour(f'     Back up  {a.name} -> {backup.name}', '33'))
    elif kind == 'promote':
        print(colour(f'     Move     {a.name} -> {c.name}', '33'))
    elif kind == 'reverse':
        print(colour(f'     Remove   {c.name} (reverse symlink)', '33'))
        print(colour(f'     Move     {a.name} -> {c.name}', '33'))
    print(colour(f'     Link     {a.name} -> {c.name}', '32'))
    print()


def snapshot(plans):
    result = []
    for _, c, a, backup in plans:
        for p in (c, a, backup):
            if p is None:
                continue
            if os.path.lexists(p):
                s = p.lstat()
                result.append((str(p), str(p.parent.resolve()), s.st_dev, s.st_ino,
                               s.st_mode, s.st_size, s.st_mtime_ns,
                               os.readlink(p) if p.is_symlink() else None))
            else:
                result.append((str(p), str(p.parent.resolve()), None))
    return result


def apply(plan):
    kind, c, a, backup = plan
    if kind == 'replace':
        a.rename(backup)
        try:
            a.symlink_to(c.name)
        except OSError:
            backup.rename(a)
            raise
    elif kind in {'promote', 'reverse'}:
        target = os.readlink(c) if kind == 'reverse' else None
        if target is not None:
            c.unlink()
        try:
            a.rename(c)
        except OSError:
            if target is not None:
                c.symlink_to(target)
            raise
        try:
            a.symlink_to(c.name)
        except OSError:
            c.rename(a)
            if target is not None:
                c.symlink_to(target)
            raise
    else:
        a.symlink_to(c.name)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', type=Path,
                        default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--check', action='store_true', help='Preview only; exit 1 if fixes or problems exist')
    parser.add_argument('--pre-push', action='store_true',
                        help='Prompt via the terminal, then stop the push after fixes for review')
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f'Not a directory: {root}')
    plans, problems = scan(root)
    print(colour('\nAgent instruction links', '1'))
    print(f'  Repository: {short_path(root)}')
    print(colour('  Includes symlinked and gitignored folders; skips Git metadata, dependencies and caches.', '2'))
    print()
    if problems:
        print(colour(f'Manual review needed ({len(problems)})', '1;33'))
        for problem in problems:
            print('  ! ' + problem.replace(str(root) + '/', '').replace(str(Path.home()) + '/', '~/'))
        print()
    if not plans:
        print(colour('No automatic fixes needed.', '32' if not problems else '33'))
        return int(bool(problems))
    print(colour(f'Proposed changes ({len(plans)} folders)\n', '1'))
    for number, plan in enumerate(plans, 1):
        describe(plan, root, number)
    backups = sum(plan[0] == 'replace' for plan in plans)
    summary = f'{len(plans)} symlinks to create'
    if backups:
        summary += f' · {backups} existing file(s) to back up'
    print(colour(summary, '1'))
    print('Existing contents will be preserved. Nothing will be staged or committed.')
    if any(root not in plan[1].parent.resolve().parents and root != plan[1].parent.resolve() for plan in plans):
        print(colour('Some changes affect folders outside this repo (see Location above).', '33'))
    if args.check:
        print(colour('\nPreview only; no changes made.', '2'))
        return 1
    before = snapshot(plans)
    try:
        prompt = colour('\nApply these changes? [y/N] ', '1')
        if args.pre_push:
            # Git owns stdin here: it contains ref updates, not user input.
            try:
                with open('/dev/tty', 'r+') as terminal:
                    terminal.write(prompt)
                    terminal.flush()
                    answer = terminal.readline().strip().lower()
            except OSError:
                print('\nCannot prompt here. Run python3 scripts/sync-agent-instructions.py in a terminal, then retry the push.')
                return 1
        else:
            answer = input(prompt).strip().lower()
    except (EOFError, KeyboardInterrupt):
        print('\nCancelled; no changes made.')
        return 1
    if answer not in {'y', 'yes'}:
        print('Cancelled; no changes made.')
        return 1
    # Recheck the entire plan before writing, including paths through symlinks.
    current, current_problems = scan(root)
    if current != plans or current_problems != problems or snapshot(plans) != before:
        print('Files changed since the preview. Rerun to review a fresh plan.', file=sys.stderr)
        return 1
    for plan in plans:
        try:
            apply(plan)
            print(colour(f'  Fixed {short_path(plan[2], root)}', '32'))
        except OSError as exc:
            print(f'Stopped: {exc}. Earlier fixes remain; rerun to inspect.', file=sys.stderr)
            return 1
    if args.pre_push:
        print('\nFixes applied. Push stopped so you can review them and commit any tracked changes, then push again.')
        return 1
    return int(bool(problems))


if __name__ == '__main__':
    sys.exit(main())
