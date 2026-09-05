---
name: find-speakers
description: Research and shortlist external speakers for a webinar, panel, or conference, including direct work emails and reasons-they-fit, output as a CSV alongside a short top-picks summary. Use this skill whenever the user wants to find people to invite as speakers, panellists, contributors, or interviewees - including phrases like "find me speakers for…", "who could we invite to talk about…", "draw up a shortlist of speakers", "build a speaker list", "I need contributors for our webinar on X", "research speakers and their emails", or anything else where the user is sourcing external voices for a session. Also use when the user is doing follow-up research on a specific topic to find named experts to approach.
---

## Tools to use

This skill assumes three MCP servers are connected (`claude mcp list` confirms):

| Tool | When to use |
|---|---|
| **Exa** (`mcp__exa__web_search_exa`, `mcp__exa__web_fetch_exa`) | Default for finding names and scraping staff pages. Exa's `web_search_exa` is materially better than the built-in WebSearch for the "describe the ideal page" style of query this work needs, and `web_fetch_exa` can read pages that the built-in WebFetch is blocked from (e.g. `parliament.uk` committee membership pages). |
| **Firecrawl** (`mcp__firecrawl__firecrawl_scrape`, `mcp__firecrawl__firecrawl_extract`) | Fallback for JS-heavy or stubborn org staff pages where Exa returns thin content. Use `firecrawl_extract` when you need structured output (e.g. a list of all named senior staff with role and email from a single page). |
| **Hunter** (`mcp__hunter__Email-Finder`, `mcp__hunter__Email-Verifier`, `mcp__hunter__Domain-Search`) | Default for finding and validating direct work emails. Replaces the entire "guess the pattern" loop. See Pass 3 for the order of attack. |

Use the built-in `WebSearch` and `WebFetch` only as a last resort if all three MCPs are unavailable. The MCP versions are stronger on every dimension that matters here.

# Find Speakers

A repeatable workflow for putting together a shortlist of external speakers for an event, including direct emails and a written rationale for each pick.

**Wrong skill?** This one produces 8-12 curated names with a per-person rationale, for hand-written invitations. If the user wants volume instead - a few hundred contacts to fill a course, an event audience, a campaign list, anything destined for a mail merge - use `/find-bulk-contacts`, which handles bulk harvesting, per-organisation relevance rules and deliverability at scale.

## What this skill produces

Two artefacts, every time:

1. **A CSV** at `projects/<project>/<YYYY-MM>-<topic-slug>-speaker-shortlist.csv` (inside the relevant project folder, e.g. `projects/nomos/audience/`) containing one row per candidate, with the columns defined in the [CSV schema](#csv-schema).
2. **A short top-picks summary in chat** highlighting the 3–4 strongest candidates with a one-line rationale each, plus any gaps or caveats the user should know about before they start sending invitations.

The CSV is the artefact the user will actually act on (sorting, filtering, sending invites). The chat summary is the editorial layer that helps the user prioritise.

## The workflow

The aim is a *defensible* shortlist - every candidate should have a clear reason to be on it, an email the user can act on, and a source they could verify themselves in two minutes. Get there in three passes.

### Routing: is this a UK / EU public policy event?

Before starting, check whether the brief is for a **Public Policy Exchange event** or any **UK / EU public-policy conference, symposium, or roundtable**. The signals are: the user mentions Public Policy Exchange (PPE), the event audience is mixed politicians / academics / civil servants / charities / private sector, or the topic is a domestic UK or EU policy area (e.g. education funding, housing, social care, devolution, the EU AI Act). These events need a deeper list (30–40 candidates), a different sourcing approach (media coverage and parliamentary activity first), and a known set of UK-specific resources (House of Commons Library, APPGs, PolicyMogul, broadsheets).

If yes, read `references/uk-policy-events.md` and follow the three-stage process described there instead of the default Pass 2. The brief, email-discovery, and CSV-output sections below still apply.

If not, continue with the default workflow.

### Pass 1: Capture the brief

Before any web searching, make sure you know:

- **The session topic** and the framing question it asks (e.g. "what makes knowledge sharing across EMBs actually work?")
- **The session format** and what the speaker slot looks like (15-min talk + Q&A? panel? interview?)
- **The audience** (practitioners? researchers? mixed?)
- **What the user has already tried or ruled out** - existing contacts, people previously approached, names the user has already considered

If any of this is missing and would shape the shortlist, ask. Don't research blind - it wastes effort on weak fits.

If the conversation already contains a webinar / event page / brief, extract the answers from there before asking the user. Don't re-ask things that are already on the page.

### Pass 2: Two-pass research

Do both of these. They surface different people, and using both is what makes the shortlist defensible.

**Pass A - org-first.** List the organisations that obviously own this topic (think tanks, NGOs, multilateral bodies, professional associations, university research centres, regulators). For each, find the senior people whose remit is closest to the session topic. This catches the well-positioned people whose names you can recite.

**Pass B - content-first.** Search for recent papers, panels, conference sessions, webinars, blog posts, and reports on the exact topic. Pull names from bylines, panel programmes, and acknowledgements. This catches the people who have actually said something publicly on the topic - much stronger signal than "senior person at relevant org" - and surfaces names the org-first pass would miss.

Note when a name appears in both passes - that's reinforced signal worth flagging in the top picks.

A reasonable target is **8–12 candidates across both passes combined**, with substance, not 30 weak names. If the topic is narrow, fewer is fine. If the topic is broad and the user needs many invites because acceptance rates are low, push for more.

**How to drive Exa and Firecrawl in this pass.** Exa's `web_search_exa` takes a natural-language description of the ideal page, not keywords — so phrase queries like "panel programme for a UK conference on AI in healthcare in 2025 with named speakers", not "AI healthcare speakers UK". Append `category:people` for LinkedIn-style profile results when you need to confirm someone's current role. Batch URLs into a single `web_fetch_exa` call to read several staff pages in one shot. If a target page returns thin or garbled content from Exa (common on JS-rendered React org sites), retry with `mcp__firecrawl__firecrawl_scrape`; if you want all named senior staff out of a single people-page as structured data, use `mcp__firecrawl__firecrawl_extract` with a small JSON schema.

### Pass 3: Find emails

This is the part most speaker-research workflows get wrong. The rule:

**Direct work emails only. Never `info@`, `contact@`, `press@`, or any general inbox.** These don't reach the person and the user has explicitly said so.

#### Order of attack (Hunter-first)

For each candidate, run this sequence:

1. **`mcp__hunter__Email-Finder`** with the person's full name and the org's primary domain (the website domain, not the email domain — Hunter resolves the mail domain). This is the default first step for every candidate. The response includes a `score` (0–100), a `verification.status` (`valid`, `accept_all`, `invalid`), and a `source_type` (`found` if Hunter saw the address on a public page, `generated` if it was derived from the org's pattern).
2. **`mcp__hunter__Email-Verifier`** on the returned address — confirms SMTP-deliverability. The Email-Finder response already includes a `verification.status` block; only re-call Email-Verifier if you need a second-opinion or if the Email-Finder result is older than a few weeks. If `status` is `valid`, mark `verified` in the CSV. If `accept_all` or `risky`, mark `accept_all`. If `invalid` and the domain accepts SMTP probes (i.e. `smtp_check` ran), drop the candidate to `linkedin`.
3. **`mcp__hunter__Domain-Search`** when Email-Finder returns nothing for the org — this reveals the org's email pattern (e.g. `{first}.{last}` or `{f}{last}`) plus several named staff Hunter already has. Apply that pattern to your candidate and verify with Email-Verifier. Mark as `pattern`.
4. **Exa or Firecrawl on a staff / faculty / paper page** as a confirming source. University faculty pages list direct emails reliably; academic paper PDFs print the corresponding-author email in the byline. If Hunter has returned a verified address that matches a staff page, the source is the staff page URL, not Hunter.
5. **LinkedIn fallback.** If steps 1–4 all fail, set `Email` empty and `Email status` to `linkedin`.

#### Known SMTP-blocked domains

The following domains refuse SMTP verification probes by design. Hunter will return `invalid` or fail to verify, but the addresses are usually still real. Mark as `pattern` and note in the Source column that the domain blocks SMTP verification.

- `*.nhs.net` — NHS England staff
- `*.gov.uk` (most departments, including `mhra.gov.uk`)
- `ico.org.uk`
- `*.google.com` (Hunter never generates these — go straight to `linkedin`)

#### Two valid patterns can coexist

Some organisations operate more than one valid pattern simultaneously. Most notably, `parliament.uk` accepts both `firstname.lastname.mp@parliament.uk` (the public-facing form) and `surname+firstinitial@parliament.uk` (the internal form) — Hunter will sometimes return one and sometimes the other for the same MP, and both are deliverable. Use whichever Hunter verifies; don't assume one is wrong because the other is what you expected.

**Never invent an email.** If Hunter can't verify and you can't see the exact address on a public page, set the email column empty and the status to `linkedin`.

### Top picks (chat summary)

After the CSV is written, pull out the 3–4 strongest candidates. "Strongest" means some combination of: directly on-topic published work, role specifically about the session's subject, reinforced across both research passes, and an email you're confident in.

Each top pick gets a one-line "why this person" rationale - the same wording you'd use in the eventual invitation. Then flag:

- Any **gaps** in the shortlist (regions or perspectives missing)
- Any **caveats** about email verification (e.g. "all IDEA addresses are pattern-inferred, worth a LinkedIn check first")
- Reserves not pursued but worth keeping in mind

Keep this summary short - the CSV is the substance.

## CSV schema

Write the CSV with this exact header row, in this order:

```
Name,Role,Organisation,Bucket,Why they fit,Email,Email status,Source
```

Field definitions:

| Column | Meaning |
|---|---|
| `Name` | Person's name with title where relevant (Dr / Prof) |
| `Role` | Current role |
| `Organisation` | Current org |
| `Bucket` | One of: `top pick`, `shortlist`, `reserve` |
| `Why they fit` | 1–2 sentences linking their work to the session topic. Specific - cite a paper, programme, or appointment. This text often forms the personalised paragraph in the eventual invitation. |
| `Email` | Direct work email, or empty if none found |
| `Email status` | One of: `verified` (Hunter Email-Verifier returned `valid`, or the exact address is on a public page), `accept_all` (Hunter returned `accept_all` — domain accepts mail to any address, so likely valid but not individually confirmed), `pattern` (the org's email pattern is known from Hunter Domain-Search or a public source, applied to this candidate, but SMTP verification was blocked or skipped), `inferred` (legacy synonym for `pattern`, for older CSVs), `linkedin` (no email found, suggest LinkedIn outreach) |
| `Source` | URL or short description of where the candidate / email came from (e.g. faculty page URL, paper title, conference programme). If Hunter Email-Finder returned the address, cite `Hunter Email-Finder status valid (score X)` plus the source URL Hunter linked to if available. |

Use CSV quoting for any field containing commas, quotes, or newlines (double-quote the field, escape internal quotes as `""`).

## File naming

`projects/<project>/<YYYY-MM>-<topic-slug>-speaker-shortlist.csv` where:

- `<project>` is the relevant project folder (e.g. `nomos/audience`, `awards26`). If the project is not obvious from the brief, ask which project folder to use.
- `YYYY-MM` is the current year and month
- `topic-slug` is a short kebab-case slug capturing the topic (e.g. `knowledge-sharing`, `electoral-workforce`, `disinformation-response`)

The CSV is a data deliverable, so it lives inside the relevant project folder under `projects/`. There is no top-level `emails/` directory: draft emails are transient (composed, sent, then deleted), so a persistent contact list like this belongs with the project it serves.

## Style and tone

- British English throughout (`organisation`, `programme`, `centre`)
- Avoid em dashes - use commas, full stops, or parentheses instead. This matches the user's general drafting style and keeps the CSV cleanly importable.
- "Why they fit" should be plain, specific, and free of superlatives. Cite something concrete.
- Don't pad the shortlist with weak names to hit a number. Substance over volume.

## Example top-picks summary (for shape, not content)

```
## Top picks
1. Dr A — directly on-topic 2024 paper, verified email
2. Dr B — runs the closest existing programme to what we are proposing, verified email
3. C — practitioner perspective from the relevant region, pattern-inferred email
4. D — reinforced (appeared in both research passes), verified email

## Caveats
- IDEA addresses are pattern-inferred, worth a LinkedIn check before sending
- No African EMB voice in the shortlist - worth adding if regional balance matters

## Reserves
- E, F, G — competent fits, didn't make the top tier
```
