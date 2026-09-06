# Share personal Claude and Codex files

Run from the repo root:

```bash
python3 scripts/sync-home-agent-config.py

# Preview without prompting or writing:
python3 scripts/sync-home-agent-config.py --check
```

The script previews moves, backups and symlinks, then asks before applying them. Enter or `n` cancels. Claude files remain canonical: when content exists only on the Codex side, it moves to the Claude location and a symlink takes its place.

| Claude location | Codex location |
| --- | --- |
| `~/.claude/CLAUDE.md` | `$CODEX_HOME/AGENTS.md` (normally `~/.codex/AGENTS.md`) |
| `~/CLAUDE.md` | `~/AGENTS.md` |
| `~/.claude/skills` | `~/.agents/skills` |

The home-root instruction pair is handled separately from personal configuration. The script does not combine instruction files or rewrite their internal paths. `AGENTS.override.md` is flagged because it can override the shared personal instructions.

If only one skills folder exists, the whole folder is shared. If both exist, the script shares individual skills in both directions. New skills in separate folders are picked up on the next run. Identical copies are backed up before linking; differing copies remain untouched for manual review. Skill backups live under `~/.agents/skills-before-home-sync`, outside Codex's skills discovery folder. Each backup receives a unique suffix.

The scan covers only these known personal paths. It does not search the whole home directory or copy system/plugin skills from `~/.codex/skills` or plugin caches. Existing external or broken symlinks and symlinked configuration parents need manual review. Sharing a skill's files does not install app connections, dependencies or translate client-specific instructions.

`--home /path/to/test-home` inspects an isolated home directory. `--codex-home /path` overrides the personal instruction destination. No files change in `--check` mode; it returns 1 for proposed changes or review items, and 0 when the checked paths need no changes.

`--pre-push` prompts through `/dev/tty`, never Git's stdin. It stops after applying changes for review, and stops if no terminal is available or review items remain. This standalone script is not automatically added to the repository hook; run it when you want to share personal configuration.

Validation:

```bash
/opt/homebrew/bin/python3 -B -m unittest discover -s scripts/tests -v
```

Path references: [Claude personal instructions](https://code.claude.com/docs/en/memory), [Codex personal instructions](https://developers.openai.com/codex/guides/agents-md), [Codex skills](https://developers.openai.com/codex/skills).
