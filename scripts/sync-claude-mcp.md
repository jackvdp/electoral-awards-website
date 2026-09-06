# Copy Claude MCP definitions to Codex

Run from the repo root:

```bash
python3 scripts/sync-claude-mcp.py
```

The script lists saved Claude servers, their scopes, duplicate definitions and whether Codex already has them. It previews the destination and backup before asking `Add these servers to Codex? [y/N]`. Press Enter or answer `n` to leave everything unchanged. It adds all entries labelled **ADD**; existing or unsupported entries are left for review.

```bash
# Preview without prompting or changing files:
python3 scripts/sync-claude-mcp.py --check

# Import into Codex's user configuration instead of this repo:
python3 scripts/sync-claude-mcp.py --target user

# Inspect another checkout or a nonstandard Claude config location:
python3 scripts/sync-claude-mcp.py --project /path/to/repo --claude-config /path/to/.claude.json
```

Python 3.11+ is required. On Apple Silicon Macs the script automatically retries with `/opt/homebrew/bin/python3` if the default Python is older.

## Sources and precedence

| Claude scope | Read from |
| --- | --- |
| User | `~/.claude.json` → `mcpServers` |
| Project | `<repo>/.mcp.json` → `mcpServers` |
| Local | `~/.claude.json` → `projects[<repo>]` → `mcpServers` |

Local overrides project, which overrides user. A higher-priority server replaces the complete lower-priority definition. Known project disable flags are honoured. This is an inventory of saved definitions, not a live connection test: managed policies, runtime CLI flags, plugins and claude.ai connectors can affect the tools Claude actually exposes.

The default destination is `<repo>/.codex/config.toml`, including for servers originating in Claude user scope. This keeps the import limited to the current project. `--target user` writes to `$CODEX_HOME/config.toml` (normally `~/.codex/config.toml`), making additions available across projects. Both user and project Codex configurations are checked for existing names. Existing entries are never overwritten or enabled automatically; differences are labelled for review.

## What gets copied

HTTP URLs and headers, or stdio commands, arguments and environment settings. Stdio entries retain the inspected project's working directory. Relative resource paths therefore still refer to that project, including with a user-scoped destination.

Simple HTTP header environment references remain references. Other `${VAR}` and `${VAR:-default}` expressions are resolved using the script's environment when importing; missing variables block that server. Restarting Codex from the right environment is necessary for retained references. SSE, custom OAuth settings, header helpers and unknown server fields require manual setup rather than a partial import.

URLs, argument lists and headers can contain credentials. The preview hides their values, but the resulting local configuration can contain them. After confirmation, the script saves config and backups with owner-only permissions. For project imports it adds the config and backup paths to `.git/info/exclude`, and refuses destinations already tracked by Git. Backups use `config.toml.before-mcp-sync`, with a numeric suffix if needed. Existing TOML text and unrelated settings are preserved.

OAuth sessions are not copied. Restart Codex, trust the project if using project configuration, and inspect `/mcp`. For servers requiring OAuth, run `codex mcp login SERVER_NAME` from the project directory. Configured does not necessarily mean authenticated or connected.

No Git hook is installed. `--check` returns 1 when additions or review items exist, and 0 when everything matches. A confirmed import returns 0 even if other entries still need manual review; inspect the summary.

Validation:

```bash
/opt/homebrew/bin/python3 -m unittest discover -s scripts/tests -v
```

Configuration references: [Claude MCP scopes](https://code.claude.com/docs/en/mcp#scope-hierarchy-and-precedence), [Codex MCP configuration](https://developers.openai.com/codex/mcp/).
