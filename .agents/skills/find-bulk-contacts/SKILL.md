---
name: find-bulk-contacts
description: Build a large contact list (roughly 100-500 people) for a mail merge - course delegates, event audiences, campaign targets, membership drives. Use when the user wants volume rather than a curated shortlist, e.g. "find a few hundred people who might attend X", "build me an audience list for Y", "who could we market this course to", "I need 300 contacts for the webinar", "find delegates for the training". Pairs with /send-bulk-emails, which consumes the CSV this produces. For a small curated shortlist of named experts to invite as speakers or panellists, use /find-speakers instead.
---

# Find Bulk Contacts

A workflow for building a large, mail-merge-ready contact list. The output feeds `/send-bulk-emails`.

## When to use this rather than /find-speakers

| | `/find-speakers` | `/find-bulk-contacts` |
|---|---|---|
| Size | 8-12 people | 100-500 people |
| Goal | The right individual on a stage | Enough of the right audience to fill a room |
| Rationale | Per person, cites their published work | Per organisation, reused across its staff |
| Emails | Every one individually verified | Sampled and pattern-verified at scale |
| Output feeds | A hand-written invitation | A mail merge |

Wrong skill is the common failure. "Find me someone to speak about energy planning" is `/find-speakers`. "Find me people who would pay to attend the energy planning course" is this one.

## The core constraint: Hunter's index, not Hunter's price

Hunter Domain-Search costs 1 credit per 10 emails returned. In practice that is around **1 credit per 6 usable contacts**, which is cheap: a 400-person list costs roughly 400-450 credits against a 2,000/month allowance.

What actually limits the list is **coverage**. Hunter only returns people it has already indexed. Large multilaterals index in the thousands; small national regulators index in single figures even when their staff page lists thirty people. Plan around that, not around cost.

Two consequences:

- Do not skip Hunter to save money. You will lose the email pattern and the seed contacts, and gain nothing worth having.
- Do expect to scrape staff pages for the thinly-indexed organisations (Pass 4).

## Pass 1: Capture the brief

Ask before researching, because these change the work materially:

- **Target size** and whether the user prefers a tighter, higher-quality list over hitting a number
- **Geography** (regions, or a named list of countries)
- **Sector mix** (government, regulators, utilities, development finance, NGOs, academia, private sector)
- **Verification appetite** - bulk harvest, individually verified, or hybrid (verify a priority tier only)
- **Output location** - which `projects/<project>/` folder
- **Suppression list** - anyone already contacted, already booked, or previously declined

Use the current client’s question tool for these, or ask directly if unavailable. Also ask for anything needed by the eventual email but not by the list itself (dates, price, booking link) and flag that it is not blocking, then get on with the research.

## Pass 2: Probe coverage before spending anything

Build a candidate domain list from the obvious owners of the topic: ministries, regulators, agencies, regional bodies, development banks, sector NGOs, professional associations, membership bodies.

Then, **before any Domain-Search**, run the free tools:

- `hunter / Get-Usage` - credits and verifications remaining, and the reset date. Free.
- `hunter / Find-People` with a `domains` array of up to 100 candidate domains - returns how many personal and generic emails Hunter holds per domain. Free.
- `hunter / Find-Companies` - free, useful when you need to discover orgs rather than confirm them.

This tells you which domains are worth credits and which need scraping, in one call and at no cost. Sort the result by `emails_count.personal` and plan from there. Treat anything under about 10 as a Pass 4 scraping target rather than a Domain-Search target.

## Pass 3: Harvest, and keep it out of context

**This is the step that makes or breaks the run.** Hunter results carry a large `sources` array per contact, so a single 70-contact organisation can be 45KB or more. Pulling several thousand contacts through conversation context will exhaust it long before the list is finished.

Save full Domain-Search responses to a temporary directory outside the repo. If the client persists large tool results, use the file path it reports. Otherwise use its tool-output export or a local API script to save the complete JSON response. Never save a truncated preview as the source data.

- Call Domain-Search with **`limit: 100`** and **no narrow filters**, then paginate as required.
- Keep one response per `.txt` file containing JSON with the `data` object used by the extraction scripts. Unwrap client-specific tool-result envelopes first.
- Set `TR` to that directory when using the harvest toolkit. Do not assume a client’s session directory or spill threshold.
- Batch independent domains when the client supports it.

Extract everything from disk with `jq`, never by reading the JSON. See `references/harvest-toolkit.md` for the ready-made extraction, filter and build scripts.

For very large generalist organisations (World Bank, UNDP, GIZ) add `department: "management,executive"` to keep the payload relevant, and rely on the Pass 5 keyword rule to drop the rest.

## Pass 4: Close the coverage gaps by scraping

For the organisations Hunter barely indexes, and only for those:

1. Note the org's `pattern` field from its Domain-Search response. Observed values include `{first}.{last}`, `{f}{last}`, `{first}`, `{first}{last}` and `{last}{f}`. The tokens are `{first}`, `{last}`, `{f}`, `{l}`. Take the pattern from the response rather than guessing it: `{last}{f}` and `{last}{first}` differ by one character and produce silently undeliverable addresses.
2. Scrape the staff, leadership, board or team page with Exa `web_fetch_exa`, falling back to `firecrawl / firecrawl_scrape` for JS-heavy sites.
3. Generate candidate addresses by applying the pattern to each scraped name.
4. **Verify them** with `hunter / Email-Verifier` before they go anywhere near a send. Generated-and-unverified is the one combination to avoid.

Accents, hyphens and middle names are the usual failure. Strip diacritics, keep hyphens only if the pattern shows them, and prefer the name as printed on the staff page over a LinkedIn rendering.

## Pass 5: Filter for relevance

Raw harvest is roughly half unusable. Two rules do most of the work.

**Rule 1 - role exclusions, applied everywhere.** Drop IT, HR, payroll, procurement, supply chain, finance and accounting, legal, communications, media and PR, marketing, events, admin and PAs, interns, drivers, security and facilities. None of them attend a technical course on their employer's budget.

**Rule 2 - specialist versus generalist organisations.** This is the important one.

- At a **specialist** organisation, the whole institution is on topic, so keep every non-excluded role. An energy regulator, an energy ministry, a rural electrification agency, a regional energy centre, IRENA.
- At a **generalist** organisation, keep only people whose job title itself matches the topic. The World Bank, UNDP, GIZ, UN regional commissions, the Pacific Community.

Misclassifying a generalist body as specialist is the most common quality failure. A UN regional commission is not an energy body: classify it generalist or you will ship its gender advisers and urbanisation chiefs on an energy list. When unsure, classify generalist.

Also exclude adjacent-but-wrong specialisms explicitly. On an energy list, mining and geology roles need dropping even though they sit inside "Ministry of Mines and Energy".

## Pass 6: Balance and bucket

**Cap per organisation.** Without a cap, two or three well-indexed bodies supply half the list. Around 18 per organisation works for a 400-person target. Apply the cap after sorting by bucket then confidence, so the cap keeps the best rows.

**Bucket for outreach priority**, not for quality:

- `top pick` - senior decision-makers (director, head, chief, commissioner, principal) at specialist organisations. They need the training and can authorise the spend.
- `shortlist` - managers, senior officers, engineers, planners, analysts in on-topic roles.
- `reserve` - weaker fits, kept back.

Report the distribution. If `top pick` is more than about 40% of the list the rule is too loose to be useful.

## Verification strategy

Full individual verification of 400 contacts is rarely worth it. Instead:

1. Take everything Hunter already verified during Domain-Search for free.
2. **Spot-verify a sample** of roughly 10 pattern-inferred addresses spread across domains, and report the observed hit rate. Expect around 80% valid on Hunter-sourced pattern addresses, lower on scraped-and-generated ones.
3. Offer to fully verify the `top pick` tier so the user has a clean first wave.

**Budget both quotas.** Domain-Search consumes verification quota as well as search credits (one observed run: 88 to 854 verifications used while spending 427 search credits). Check `Get-Usage` again before promising a large verification pass.

**Warn about deliverability.** A bulk send to several hundred partly-inferred addresses will bounce, and a high bounce rate damages sender reputation on the sending domain. Recommend warming up in waves, best-verified first, rather than sending the whole list at once. Say this explicitly in the summary; it is the user's decision but they need it flagged.

## CSV schema

```
Name,Role,Organisation,Region,Bucket,Why they fit,Email,Email status,Source
```

| Column | Meaning |
|---|---|
| `Name` | Full name, title where known |
| `Role` | Current role, from `position_raw` where available |
| `Organisation` | Readable org name, not the domain |
| `Region` | Country, or region for multi-country bodies. Drives geographic balance checks |
| `Bucket` | `top pick`, `shortlist`, `reserve` |
| `Why they fit` | Written **per organisation** and reused across its rows, with a role-specific clause appended for generalist orgs. Do not attempt 400 bespoke rationales |
| `Email` | Direct work email. Never `info@`, `contact@` or any generic inbox |
| `Email status` | `verified`, `accept_all`, `pattern`, `linkedin` |
| `Source` | `Hunter Domain-Search, confidence N`, plus `; spot-verified via Hunter Email-Verifier` where applicable, or the staff page URL for scraped rows |

Quote any field containing commas. Keep the column order stable so `/send-bulk-emails` can consume it unchanged.

## File naming

`projects/<project>/<YYYY-MM>-<topic-slug>-contacts.csv`

Use `-contacts` rather than `-speaker-shortlist` so the two skills' outputs stay distinguishable in a project folder.

## Handover

Close with a summary that gives the user what they need to act:

- Total contacts, organisations, regions
- Bucket distribution and email status distribution
- The spot-check result and expected bounce rate, stated plainly
- **Thin spots**, named. Which organisations or regions are under-represented and why, so the user can decide whether to commission manual sourcing
- Any judgement call worth surfacing, for example when the largest segment needs employer or donor sponsorship to attend a paid course
- What is still needed before a send: dates, price, booking link, suppression list

Then offer the handover to `/send-bulk-emails`.

## Style

- British English (`organisation`, `programme`, `centre`)
- No em dashes, in the skill output or the CSV
- "Why they fit" stays plain and specific, no superlatives
- Do not pad the list to hit a number. Say the number you reached and why
