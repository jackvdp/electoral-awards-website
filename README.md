# ICPS Launchpad

Jack Vanderpump's working repo (ICPS, Head of Policy Research). Holds the **electoralnetwork.org** Next.js site alongside the skills, drafts, and notes that run the Electoral Members' Network and the International Electoral Awards programme.

```
.
├── web/                Next.js app (electoralnetwork.org) — see web/README.md
├── .agents/skills/     Shared skills (admin + website)
├── .claude/skills/     Compatibility symlinks to shared skills
├── agent-support/     Agent setup and MCP inventory
├── docs/               ICPS reference docs (Horizon, webinars)
├── projects/           Cross-cutting work
├── scripts/            Admin AppleScripts
├── AGENTS.md           Shared routing and conventions
└── CLAUDE.md           Imports AGENTS.md for Claude Code
```

## Working on the website

```bash
cd web
npm install
npm run dev
```

Full notes in [`.agents/skills/website-dev/SKILL.md`](.agents/skills/website-dev/SKILL.md) or invoke `$website-dev` in Codex / `/website-dev` in Claude Code.

## Deployment

Vercel builds from `web/`. The project's **Root Directory** is set to `web` in the Vercel dashboard (Settings → General → Root Directory); default Next.js commands then work unchanged. Do not add a root-level `vercel.json` — it conflicts with framework detection.

## Skills

The 17 repository skills live in `.agents/skills`; Claude Code discovers the same files through symlinks. See [AGENTS.md](AGENTS.md) for routing and [agent setup](agent-support/README.md) for fresh checkouts, worktrees, private project migration and [MCP configuration](agent-support/mcp.md).
