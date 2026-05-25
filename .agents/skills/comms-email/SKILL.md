---
name: comms-email
description: Draft an HTML email template (.eml) for the 2026 comms plan. Specify an email number (e.g. "email 3") or topic and the skill will generate the template, save it, and update the comms plan data.
argument-hint: [email number or topic, e.g. "email 3" or "nominations open"]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Comms Plan Email Builder

Generate downloadable `.eml` HTML email templates for the 2026 delegate acquisition comms plan and link them into the admin dashboard.

## Context

The comms plan lives in two places:

| File | Purpose |
|------|---------|
| `src/data/comms-plan-2026.ts` | Structured data — email schedule with subjects, audiences, CTAs, status, and `templateFile` references |
| `pages/admin/comms-plan.tsx` | Admin dashboard — displays the plan and offers download links for emails that have a `templateFile` |

Email templates are stored as `.eml` files in the `emails/` directory. The API route at `pages/api/comms-templates/[filename].ts` serves them as downloads (admin-only).

## Steps

### 1. Identify the email

Read `src/data/comms-plan-2026.ts` and find the email the user is asking about — by ID number, subject, topic, or the next pending email in sequence.

Note the following fields which inform the content:
- `primary` — the main message/purpose
- `secondary` — supporting message
- `subject` — the email subject line
- `cta` — call-to-action button text
- `audience` — who receives it
- `detail` — detailed content guidance
- `tags` — content themes (registration, nominations, webinars, speakers, programme, logistics)

### 2. Review existing templates for style

Read 1-2 existing `.eml` templates in `emails/` to match the established visual style. The key design elements are:

- **Wrapper:** Full-width `#f4f4f4` background, centred 640px white container
- **Header banner:** `#1a2744` dark blue with white title text, `#243358` sub-banner
- **Body:** `36px 40px` padding, `#333333` body text at 15px/1.6 line-height
- **Info boxes:** `#f0f4f8` background with `4px` left border (`#1a2744` for main content, `#e8a317` amber for webinars)
- **Key details:** Two-column table with bold labels in `#666` and values in `#333`
- **Schedule tables:** Alternating `#f8f9fa` / white rows with `#e9ecef` borders
- **CTA buttons:** Centred, `#1a2744` background (or `#e8a317` for webinars), white bold text, `6px` border-radius, `14px 36px` padding
- **Dividers:** `1px solid #e9ecef` between sections
- **Signature:** Name, title, organisation, contact details separated by `1px solid #dee2e6` top border
- **Footer:** `#f8f9fa` background with `#999` text noting UNPAN affiliation

**Typography:**
- Headings: `#1a2744`, 16px, bold
- Body: `#333333`, 15px, line-height 1.6
- Secondary text: `#555`, 13-14px
- Labels: `#666`, 14px, bold
- Font stack: `Arial, Helvetica, sans-serif`

**Salutation:** "Dear colleague," (not "Dear esteemed colleague" — that was only for the formal invitation)

### 3. Gather any additional context

If the email references specific content (webinar details, speaker names, event pages), check:
- `src/data/comms-plan-2026.ts` for the detail field
- `src/data/schedule.ts` for programme details
- `src/data/award-categories.ts` for category information
- `src/data/judges.ts` for judging committee
- Existing emails in `emails/` for event URLs, registration links

**Key URLs:**
- Awards registration: `https://www.electoralnetwork.org/events/69938de4f4f23e0fef2e3129`
- Workforce webinar: `https://www.electoralnetwork.org/events/69a5e816d4cec1d1c565819e`
- Website: `https://www.electoralnetwork.org`
- Contact: `electoral@parlicentre.org`

### 4. Generate the `.eml` file

Create the file at `emails/2026-XX-email-NN-<slug>.eml` where:
- `XX` = month number (two digits) based on the `wc` date
- `NN` = email ID number (two digits, zero-padded)
- `<slug>` = short kebab-case description

The `.eml` format requires these headers before the HTML:

```
From: Jack Vanderpump <Jack.Vanderpump@publicpolicyexchange.co.uk>
Subject: <subject from comms plan>
MIME-Version: 1.0
Content-Type: text/html; charset="UTF-8"
X-Unsent: 1
```

`X-Unsent: 1` ensures Apple Mail opens it as a draft rather than a received message.

**Content rules:**
- British English throughout
- Professional, warm, concise tone
- Use `&ndash;` for date ranges, `&mdash;` for em dashes, `&rsquo;` for apostrophes, `&amp;` for ampersands
- All inline CSS (no `<style>` blocks — email clients strip them)
- Tables for layout (`role="presentation"`)
- Include the signature block and UNPAN footer
- Correct days of the week: 29 Nov 2026 = Sunday, 30 Nov = Monday, 1 Dec = Tuesday, 2 Dec = Wednesday, 3 Dec = Thursday
- Do NOT include a "Dear esteemed colleague" — use "Dear colleague,"
- Always include at least one CTA button
- End with "Kind regards," (no name after — it's in the signature block)

### 5. Update the comms plan data

Edit `src/data/comms-plan-2026.ts` to:
1. Add `templateFile: '<filename>.eml'` to the email entry
2. Change `status` from `'pending'` to `'drafted'`

### 6. Report back

Tell the user:
- Which email was created (number, subject)
- The filename
- That the download button is now available on the admin comms plan dashboard
- A brief summary of the email content

## Style Notes

- **British English** throughout (organise, programme, centre, recognised)
- **Dates:** Day–Month–Year (e.g., 17 September 2025), correct days of the week
- **Acronyms:** Define on first use (ICPS, COMELEC, EMB)
- **Tone:** Professional, warm, concise — not salesy
- **Links:** Always use full `https://` URLs
- **Images:** Do not embed images — email clients block them unreliably

## Example

User: "draft email 4 for the comms plan"

1. Read `comms-plan-2026.ts`, find email #4: "Nominations now open"
2. Read existing `.eml` templates for style
3. Check `award-categories.ts` for category names
4. Generate `emails/2026-04-email-04-nominations-open.eml`
5. Update comms plan: add `templateFile`, set status to `'drafted'`
6. Report: "Created Email #4 — Nominations open. Saved to `emails/2026-04-email-04-nominations-open.eml`. Download button now available on the admin dashboard."