# Electoral Members' Network — Workspace

This repo is the working directory for **Jack Vanderpump** (Head of Policy Research, ICPS). It serves two purposes:

1. The **electoralnetwork.org** website (Next.js — code lives here)
2. All **Electoral Members' Network / ICPS admin work** — emails, comms, events, articles, awards programme. Drafts and notes live alongside the code.


---

## Routing — which skill to use

| Task | Skill |
|------|-------|
| Awards programme: nominations, judging, ceremony, winners, post-event close-out, categories, venue/co-host details | `/awards-admin` |
| General ICPS / Network admin: emails, invitations, briefs, press releases, training proposals, webinars, roundtables | `/electoral-network-admin` |
| Website development (Next.js, MongoDB, components, project structure) | `/website-dev` |
| Email for the 2026 delegate-acquisition comms plan | `/comms-email` |
| Add an event/webinar to the site | `/add-event` |
| Edit an event/webinar on the site | `/edit-event` |
| Write and publish an article | `/add-article` |
| LinkedIn post on the Network organisation page | `/linkedin-post` |
| Triage Apple Mail inbox / draft replies | `/apple-mail-inbox` |
| Research and shortlist external speakers (CSV + emails) | `/find-speakers` |
| Mail-merge a template through Outlook to a CSV list | `/send-bulk-emails` |
| Make AI-sounding text read more human | `/humanizer` |

Skills load their own context when invoked — don't pre-load awards or website detail into the conversation by reading files speculatively. Use the skill.

---

## Always-on conventions

### Writing & style (everywhere)
- British English
- Professional, warm, concise tone
- Dates: 17 September 2026 (Day–Month–Year)
- Define acronyms on first use; plain language; alt text on images
– Never use m dashes

### File & path quirks
- ICPS Dropbox root: `/Users/jackvanderpump/Dropbox/My Mac (Mac-Pro)/Desktop/ICPS/Electoral/` (NOT `~/Desktop/ICPS/`)
- `.pages` (Apple Pages) files can't be read directly — use `.emltpl` or exported `.txt`
- `.emltpl` files: raw email with quoted-printable encoding; plain text usually lives in lines 20–100
- Drafted emails → `emails/` directory in this repo, named `YYYY-MM-<topic>.txt`

---

## Website quick-start (full context: `/website-dev`)

Next.js 15 (Pages Router) · TypeScript · Bootstrap 5 + SASS · MongoDB (Mongoose) + Supabase auth · AWS S3 + Vercel Blob · SendGrid + Postmark.

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
npm run sass     # Compile SCSS
```

Invoke `/website-dev` for project structure, data files, component conventions, deployment notes.
