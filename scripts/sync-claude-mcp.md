# Share MCP definitions between Claude and Codex

Run from the repo root:

```bash
python3 scripts/sync-claude-mcp.py
```

The script checks Claude → Codex and Codex → Claude in turn. Each direction previews its destination, backup and missing servers, then asks about each server one at a time. For an **ADD** item answer `y` to import it, `i` to ignore it from now on, or press Enter to leave it for another time. For a **REVIEW** item it asks whether to ignore it from now on. Earlier confirmed imports remain if you cancel later ones. Existing names are never overwritten. Unsupported settings are flagged for review.

```bash
# Preview without prompting or changing files:
python3 scripts/sync-claude-mcp.py --check

# Import into user configuration instead of project scope:
python3 scripts/sync-claude-mcp.py --target user

# Limit the import direction:
python3 scripts/sync-claude-mcp.py --direction to-codex
python3 scripts/sync-claude-mcp.py --direction to-claude

# Inspect another checkout or a nonstandard Claude config location:
python3 scripts/sync-claude-mcp.py --project /path/to/repo --claude-config /path/to/.claude.json
```

## Ignoring a server

Answering `i` (or `y` to an ignore question) appends the server name to `.mcp-sync-ignore` at the repo root, creating the file if needed. Ignored names are listed as **IGNORE** in later runs and count towards neither additions nor review items, so they no longer stop a push. The file is one name per line; `#` starts a comment. Delete a line to have the server offered again. It is gitignored because it records personal preference, and it applies in both directions. `--ignore-file PATH` points the script at a different list.

Python 3.11+ is required. On Apple Silicon Macs the script automatically retries with `/opt/homebrew/bin/python3` if the default Python is older.

## Sources and precedence

| Claude scope | Read from |
| --- | --- |
| User | `~/.claude.json` → `mcpServers` |
| Project | `<repo>/.mcp.json` → `mcpServers` |
| Local | `~/.claude.json` → `projects[<repo>]` → `mcpServers` |

Local overrides project, which overrides user. A higher-priority server replaces the complete lower-priority definition. Known project disable flags are honoured. This is an inventory of saved definitions, not a live connection test: managed policies, runtime CLI flags, plugins and claude.ai connectors can affect the tools Claude actually exposes.

For Claude → Codex, the default destination is `<repo>/.codex/config.toml`, including for servers originating in Claude user scope. This keeps the import limited to the current project. `--target user` writes to `$CODEX_HOME/config.toml` (normally `~/.codex/config.toml`), making additions available across projects. Both user and project Codex configurations are checked for existing names. Existing entries are never overwritten or enabled automatically; differences are labelled for review.

For Codex → Claude, missing names are read from user and project Codex configuration, with project definitions taking precedence. The default destination is the current project's private local scope in `~/.claude.json` (`projects[<repo>].mcpServers`). `--target user` uses its top-level `mcpServers`. `--claude-config` overrides this path for both reads and writes. Other JSON settings are preserved, though formatting is normalised. Existing Claude names in any inspected scope are left unchanged; same-name differences are reported by the Claude → Codex check. Disabled source servers are skipped in the reverse direction, and disabled destination names are not imported.

## What gets copied

HTTP URLs and headers, or stdio commands, arguments and environment settings. Stdio entries retain the inspected project's working directory. Relative resource paths therefore still refer to that project, including with a user-scoped destination.

Simple HTTP header environment references remain references. Other `${VAR}` and `${VAR:-default}` expressions are resolved using the script's environment when importing; missing variables block that server. Restarting Codex from the right environment is necessary for retained references. SSE, custom OAuth settings, header helpers and unknown server fields require manual setup rather than a partial import.

URLs, argument lists and headers can contain credentials. The preview hides their values, but the resulting local configuration can contain them. After confirmation, the script saves config and backups with owner-only permissions. For project imports it adds the config and backup paths to `.git/info/exclude`, and refuses destinations already tracked by Git. Backups use `config.toml.before-mcp-sync`, with a numeric suffix if needed. Existing TOML text and unrelated settings are preserved.

Reverse imports support HTTP URLs and headers, preserving environment header references, and stdio commands, arguments and environment values. An explicit stdio working directory must match the current project for a project-local import; other explicit working directories need a manually configured launcher because Claude has no documented equivalent field. Codex-only controls such as tool restrictions, environment forwarding, timeouts and OAuth settings require manual review. Literal `${...}` strings in Codex settings also need review so Claude does not accidentally expand them. These entries are never partially imported.

OAuth sessions are not copied. Restart the receiving client. For Codex, trust the project if using project configuration, and inspect `/mcp`. For servers requiring OAuth, run `codex mcp login SERVER_NAME` from the project directory. Configured does not necessarily mean authenticated or connected.

The repository's `.githooks/pre-push` runs this script with `--pre-push` after the instruction-link check and before the website build. To install the tracked hook in a checkout, run `cp .githooks/pre-push .git/hooks/pre-push` from the repo root (review any existing local hook before replacing it).

In hook mode, answers come from `/dev/tty`, leaving Git's ref-update input untouched. Missing servers prompt for import or ignore; review items prompt for ignore. Anything left unanswered, unavailable terminal access or remaining review items stop the push. Ignoring every outstanding item lets the push continue. Deliberately disabled Claude servers are skipped in hook mode. A successful import also stops the push so you can review the private local configuration before pushing again. If everything matches, the hook continues to the build.

`--check` returns 1 when additions or review items exist, and 0 when everything matches or is ignored. Outside hook mode, a confirmed import returns 0 even if other entries still need manual review; inspect the summary.

Validation:

```bash
/opt/homebrew/bin/python3 -m unittest discover -s scripts/tests -v
```

Configuration references: [Claude MCP scopes](https://code.claude.com/docs/en/mcp#scope-hierarchy-and-precedence), [Codex MCP configuration](https://developers.openai.com/codex/mcp/).
