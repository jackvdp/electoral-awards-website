# UK / EU public policy events (Public Policy Exchange mode)

Use this variant when the brief is for a Public Policy Exchange event, or any UK / EU public-policy conference, symposium, or roundtable. The shape of the audience is different: a mix of politicians, academics, senior civil servants, charity leaders, and private-sector voices, with high-profile generalists preferred over deep specialists.

## How this differs from the default workflow

- **Target volume:** aim for **30–40 named candidates**, not 8–12. PPE events typically need 6–7 confirmed speakers plus a chair, and acceptance rates for politicians and senior figures are low, so the list needs to be deep.
- **Profile preference:** **national first, then regional, then local.** A backbench MP beats a councillor on the same topic. A Big Six firm CEO beats a regional director. Use the `Bucket` column to tag tier (`national` / `regional` / `local`) instead of the default `top pick` / `shortlist` / `reserve`.
- **Speaker mix:** every shortlist should contain a deliberate mix across these categories - politicians (MPs, Lords, MEPs, devolved-administration members, councillors), academics (named professors), senior civil servants (named, not "officials at DfE"), charity / third-sector leaders, and private-sector voices.
- **Sourcing approach:** **content-first dominates org-first** here. Public-policy events live or die on whether the speaker has something current to say, so the route in is recent media coverage and parliamentary activity, not org charts.

## The three-stage process

### Stage 1 - find the articles and parliamentary activity

Search the recent record on the topic across:

**Broadsheet and respected media** (last 5 years, ideally last 2):
- BBC News
- Financial Times
- The Times
- The Economist
- The Guardian
- New Statesman

Use Exa's `web_search_exa` with a natural-language description of the page you want, scoped to one outlet at a time — e.g. *"Financial Times piece from the last two years on UK regulation of AI in the NHS"*. Exa's semantic match is the right shape for this; only fall back to Google with `"key phrase" site:ft.com` (etc.) if Exa returns thin results.

**Parliamentary activity:**
- **Committee membership pages** at `https://committees.parliament.uk/committee/<id>/<slug>/membership/`. The built-in WebFetch returns 403 on these — **use Exa's `web_fetch_exa`** (or Firecrawl) instead. The page lists current members with party, constituency, and chair role.
- **House of Commons Library** at <https://commonslibrary.parliament.uk/> - briefings and debate packs name the MPs and external organisations engaged on the topic. Follow the outbound links - they lead to more names.
- **All-Party Parliamentary Groups (APPGs)** - around 200 listed at <https://publications.parliament.uk/pa/cm/cmallparty/register/contents.htm>. The register also blocks WebFetch; Exa search of the register URL returns the officer list directly in the snippet, which is often enough. Find the APPG that matches the topic and lift the **Chair, Vice Chairs, and Officers** (usually 1 + 2 + 4–6 names). Do **not** invite the wider attendee list - inviting all 20+ general attendees of an APPG creates a spam-reputation problem for the organisation.
- **Parallel Parliament** (`https://www.parallelparliament.co.uk/APPG/<slug>` and `/mp/<slug>`) - the easiest way to see APPG officers and recent MP activity in one place. Both WebFetch and Exa read it cleanly.
- **PolicyMogul** (<https://policymogul.com/>) - aggregates the people active on a given policy area across Westminster, regulators, and think tanks.

**Academic voices:**
- **Exa with `category:people`** - returns LinkedIn-style profile pages for confirming current roles.
- **Google Scholar** - search the topic, filter to recent (last 5 years), and pull the names of authors with multiple publications in the space. UK-based academics will usually have a `.ac.uk` university page within one click.

### Stage 2 - capture names

As you read each article / briefing / APPG entry, write down:

- Anyone **directly quoted** ("X said…", "according to Y…")
- Anyone **named as a contributor** to a report or briefing
- **Authors of the articles themselves** if they are policy-area specialists (worth occasionally, especially New Statesman columnists)
- **Chairs and senior named figures** at organisations called out in the coverage

For each, note the article / source URL in the `Source` column so the user can see *why* this person is on the list. The user should be able to glance at any row and understand the connection.

### Stage 3 - find emails

Same rule as the default workflow: **direct work emails only, never `info@`, `contact@`, `enquiries@`, or `press@`**.

The SKILL.md "Order of attack" is **Hunter-first** for every candidate — the steps below cover the UK-policy specifics on top of that.

1. **MPs and Lords:** run `mcp__hunter__Email-Finder` with `domain: "parliament.uk"`. Hunter will return one of two valid patterns: the public-facing `firstname.lastname.mp@parliament.uk` (Lords drop the `.mp`) or the internal `surname+firstinitial@parliament.uk` (e.g. `gardnera@parliament.uk`, `clementjonest@parliament.uk`). Both work — use whichever Hunter verifies. If neither is returned, try the other one with Email-Verifier before giving up. Some MPs use constituency office addresses on their personal websites; those are also fine and Hunter sometimes surfaces them via `source_type: "found"`.
2. **Civil servants:** GOV.UK staff pages list emails for senior officials. Pattern is `firstname.lastname@<department>.gov.uk`, but **government SMTP servers block verification probes** — Hunter Email-Verifier will return `invalid`/`smtp_check: false` even for real addresses. Use Hunter `Domain-Search` to confirm the department's pattern and mark these `pattern` in the CSV.
3. **Academics:** Hunter Email-Finder against the `.ac.uk` domain works reliably. University faculty pages confirm. For Cambridge specifically, the address is often a 3-letter CRSid (e.g. `fjg28@cam.ac.uk`) rather than `firstname.lastname` — Hunter handles both, but if Email-Finder fails check the faculty page for the CRSid.
4. **Think-tank / charity / private-sector staff:** Hunter Email-Finder, then Email-Verifier. Think-tank email patterns vary more than you'd expect: King's Fund uses `{f}{last}@kingsfund.org.uk` (`swoolnough@`), Ada Lovelace uses `{f}{last}@adalovelaceinstitute.org` (`gmarcus@`), the Health Foundation uses `firstname.lastname@health.org.uk`. Don't assume — let Hunter return the pattern.
5. **Last resort:** LinkedIn. Set `Email status` to `linkedin` and leave the email column empty. Google and Microsoft never let Hunter generate addresses — go straight to LinkedIn for DeepMind, Google Health, and most Microsoft UK staff.

**Hunter Domain-Search is your fast path to the pattern** when you have several candidates at the same organisation. One Domain-Search call returns the pattern plus a handful of named staff Hunter already has, which often confirms the candidate you want without a separate Email-Finder call.

## Worked example

If the topic is *"the future of further education funding"*:

- **Stage 1:** Exa `web_search_exa` with prompts like "Financial Times feature on UK further education funding in the last two years" and "House of Commons Library briefing on FE college funding". Use `web_fetch_exa` to read the committee membership page of the Education Select Committee (WebFetch can't reach it). Find the APPG on Further Education and Lifelong Learning via Parallel Parliament. Search PolicyMogul for "further education".
- **Stage 2:** note every MP quoted on FE in the Commons briefings, the APPG officers, the named principals of FE colleges quoted in the FT, the academics writing on FE funding in *Research in Post-Compulsory Education*, and the senior civil servants named in DfE press notices. Where the candidate is at an org Exa returns thinly (a JS-heavy college site, say), fall back to Firecrawl.
- **Stage 3:** Hunter Email-Finder for every candidate, with `domain` set to the org's primary website. For DfE civil servants, Hunter will return the pattern but Email-Verifier will fail (gov.uk blocks SMTP) — mark `pattern`. For college principals, run Domain-Search on the college domain to get the pattern, then Email-Finder for the named principal.

## Output

The CSV schema is unchanged. The only differences from the default mode:

- **30–40 rows**, not 8–12
- The `Bucket` column uses `national` / `regional` / `local` to indicate profile tier
- The chat summary should highlight: any **chair candidate** (someone senior and broadly respected who could host the event), gaps in the speaker mix (e.g. "no Lords on the list", "no charity voice"), and any pattern-inferred emails that warrant double-checking before bulk invitation.
