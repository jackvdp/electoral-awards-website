# ICPS Launchpad

Jack Vanderpump's working repo (ICPS, Head of Policy Research). Holds the **electoralnetwork.org** Next.js site alongside the skills, drafts, and notes that run the Electoral Members' Network and the International Electoral Awards programme.

```
.
├── web/                Next.js app (electoralnetwork.org) — see web/README.md
├── .claude/skills/     Claude Code skills (admin + website)
├── emails/             Drafted .eml/.emltpl templates and speaker-shortlist CSVs
├── docs/               ICPS reference docs (Horizon, webinars)
├── projects/           Cross-cutting work
├── scripts/            Admin AppleScripts
├── CLAUDE.md           Routing / always-on conventions for Claude Code
└── vercel.json         Tells Vercel to build the site from web/
```

## Working on the website

```bash
cd web
npm install
npm run dev
```

Full notes in [`.claude/skills/website-dev/SKILL.md`](.claude/skills/website-dev/SKILL.md) or invoke `/website-dev` in Claude Code.

## Deployment

Vercel builds from `web/` automatically. The root [`vercel.json`](vercel.json) sets `installCommand`, `buildCommand`, `outputDirectory`, and `devCommand` to cd into `web/` before running. **Do not** set a Root Directory in the Vercel dashboard — let `vercel.json` handle it.

## Skills

Run `/` in Claude Code to see all available skills. Routing table in [CLAUDE.md](CLAUDE.md).
