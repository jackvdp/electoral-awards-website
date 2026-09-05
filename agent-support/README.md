# Working with coding agents

`AGENTS.md` holds shared repository instructions. `CLAUDE.md` imports it for Claude Code. Each skill lives once in `.agents/skills/<name>/`, with a relative symlink at `.claude/skills/<name>` so Claude Code discovers the same files.

Start either client in the repo root or `web/`. In Codex, select a skill with `$website-dev`; in Claude Code use `/website-dev`. You can also describe the task normally. Agents without skill discovery should use the routing table in `AGENTS.md` and read the relevant `SKILL.md` directly. Run skill commands from the repo root unless the skill says otherwise.

## Fresh checkouts and worktrees

1. Run `npm install` in `web/` for website dependencies. Set up `web/.env.local` separately using the existing development credentials. Skill scripts that read a root `.env.local` can use a local symlink: `ln -s web/.env.local .env.local` from the repo root.
2. Configure the services you need using [the MCP setup guide](mcp.md). Each client has its own authentication and permissions.
3. Open the worktree in your client. Verify the shared instructions load and the 17 repository skills appear. Restart the client if it was open before the migration.

Git does not copy ignored files into a worktree: `projects/`, reference documents, environment files, local MCP configuration, and Python virtual environments need separate local setup. Keep private working material out of commits. macOS Mail, Outlook and Pages workflows require those apps, `osascript`, and macOS Automation permissions; they cannot run in a Linux/cloud agent environment. The website and file-based research workflows do not depend on those apps.

Preserve Git symlinks when cloning. On Windows, enable Developer Mode and Git's `core.symlinks` support before checkout; otherwise the Claude skill aliases may be checked out as plain text. Codex still uses the real `.agents/skills` folders.

## Existing private project instructions

`projects/` is ignored, so a PR cannot migrate the project files on your machine. Shared instructions tell every agent to read legacy `CLAUDE.md` or `claude.md` when `AGENTS.md` does not yet exist.

For each local project, move its instruction file to `AGENTS.md`, then create a `CLAUDE.md` containing only `@AGENTS.md`. Check for an existing `AGENTS.md` first and merge any distinct content rather than overwriting it. Use the uppercase `CLAUDE.md` filename for the compatibility file, including when the old file was lowercase. Update local cross-references to point to `AGENTS.md`. Do this inside the original private project folder; a fresh worktree does not contain it.

## Maintaining shared skills

Edit `.agents/skills`, including templates, scripts and references. Keep skill frontmatter portable (`name` and `description`); client permissions belong in local client configuration. For a new skill, add its Claude alias from the repo root:

```bash
ln -s ../../.agents/skills/my-skill .claude/skills/my-skill
```

Use capability descriptions and `server / operation` names in instructions. Discover actual tool names and schemas in the current client. Avoid references to a client's internal session paths, tool-output thresholds or permission APIs.

`humanizer` and `automating-mac-apps` are optional personal skills referenced by existing workflows; they are not bundled in this repo. If absent, follow the shared writing conventions or the bundled Pages automation references, respectively.

The layout follows the official [Codex skill discovery](https://developers.openai.com/codex/skills/), [Claude skill symlink](https://code.claude.com/docs/en/skills) and [Claude instruction import](https://code.claude.com/docs/en/memory#agents-md) documentation.
