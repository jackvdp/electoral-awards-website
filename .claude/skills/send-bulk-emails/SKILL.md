---
name: send-bulk-emails
description: Send a personalised bulk email through Microsoft Outlook from a template (.eml/.emltpl) and a CSV. Use when the user wants to mail-merge the same message to many people with each one personalised from CSV data, e.g. "send the speaker invitations", "bulk-send the workforce-webinar email", "send this template to everyone in the shortlist", "do a mail merge from a project-folder CSV". Pairs naturally with templates from /comms-email and CSVs from /find-speakers.
argument-hint: [optional: template path, CSV path, or topic]
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, AskUserQuestion
---

# Send Bulk Emails

Mail-merge a template through Microsoft Outlook. Reads a `.eml`/`.emltpl` template and a CSV, substitutes `{{tokens}}` with CSV values, and sends one message per CSV row. Multiple recipients per row are supported (comma, semicolon, space, or newline separated). Attachments inside the template are preserved; an optional CSV `attachments` column can attach per-row files from a folder.

The skill is Claude-driven: you prepare and validate the inputs in chat, then a headless AppleScript at `scripts/send_bulk_email.applescript` drives Outlook to actually send.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Template (`.eml` or `.emltpl`) | yes | Source of the subject, body, and any embedded attachments. `{{tokens}}` in the subject and body are replaced from CSV columns. |
| CSV | yes | One row per recipient (or recipient-list). Must include a column whose header contains the word `email`. May include a column whose header contains `attachments`. All other columns become merge tokens. |
| Attachments folder | only if attachments are used | Absolute folder path. Required if the template has embedded attachments (the script re-extracts them here) or if the CSV `attachments` column references filenames. |
| Test recipient | recommended | An email address you control. Always test before bulk send. |

### Token rule

For a CSV header `name`, the template should contain `{{name}}`. The script auto-wraps plain headers, so the CSV header itself does not need braces — you can write `name`, `organisation`, `topic` etc. If a header already begins with `{{` it is used verbatim.

The `email` and `attachments` columns are not merge tokens — they drive recipient and attachment logic instead.

### Multi-recipient cells

The `email` cell may hold several addresses. Separators recognised: `,` `;` ` ` (space) and newline. Each address counts as a separate send. The 30-second inter-send delay applies between each.

## Workflow

### 1. Gather inputs

If the user has not named them, ask. Reasonable defaults:

- Templates are drafted by `/comms-email` to a working/scratch path (email drafts are not stored in the repo).
- CSVs live in the relevant project folder under `projects/` (e.g. produced by `/find-speakers`).
- Attachments usually live under `~/Dropbox/.../ICPS/Electoral/` or the relevant `projects/<project>/` folder.

Confirm absolute paths before continuing — the AppleScript needs POSIX paths.

### 2. Inspect the CSV

Read the CSV header line and a sample of rows. Identify:

- the `email` column (case-insensitive match on the header containing "email")
- the `attachments` column, if any
- every other header — these become merge tokens

Count total rows, and compute total recipients (multi-address cells expand).

### 3. Inspect the template

Read the `.eml` template's `Subject:` header and body. Find every `{{token}}` placeholder. Cross-check:

- every `{{token}}` in the template has a matching CSV column (after auto-wrapping plain headers)
- flag any CSV columns that exist but are unused (informational, not blocking)
- flag any `{{tokens}}` in the template with no matching column (blocking — abort and ask the user)

### 4. Show the user a summary

A compact dialog like:

```
Template: emails/2026-05-knowledge-sharing-webinar-speaker-invitations.eml
Subject (raw): "Speaker invitation: knowledge sharing across EMBs"
Subject (preview, row 1): "Speaker invitation: knowledge sharing across EMBs"
Body tokens: {{name}}, {{organisation}}, {{topic}}

CSV: emails/2026-05-knowledge-sharing-shortlist.csv
Rows: 12 (15 total recipients after expanding multi-email cells)
Email column: "Email" (col 6)
Attachments column: none
Merge columns: Name → {{name}}, Organisation → {{organisation}}, Topic → {{topic}}

Attachments folder: (none — template has no embedded attachments)
```

Wait for the user to acknowledge before sending anything.

### 5. Send a test

Always run a test send first. Ask the user for their own email address (default to `jack@vanderpump.tech` from memory) and run:

```bash
osascript "<skill-dir>/scripts/send_bulk_email.applescript" \
  "<absolute template path>" \
  "<absolute CSV path>" \
  "<absolute attachments folder or empty string>" \
  "<test email address>"
```

The script will send a single preview using row 1 of the CSV, with `[TEST]` prefixed onto the subject. Tell the user the test has been triggered, and ask them to check Outlook's Sent folder and the test inbox before continuing.

### 6. Confirm and send all

Once the user has confirmed the test looks right, run the same command **without the test-email argument**:

```bash
osascript "<skill-dir>/scripts/send_bulk_email.applescript" \
  "<absolute template path>" \
  "<absolute CSV path>" \
  "<absolute attachments folder or empty string>"
```

The script sends one email per recipient with a 30-second delay between each (Outlook/Exchange throttling guard). Progress is logged per row. The command will take roughly `total_recipients × 30s` to complete — run it in the background if the user wants control back, and report the final sent / errors count.

To override the delay (e.g. for a small list), pass a fifth positional argument with the delay in seconds. Do not go below 10 seconds without good reason.

## Pre-flight checks (Claude must run these)

Before invoking the AppleScript, verify:

1. **Outlook is the user's send client.** It is (jack@vanderpump.tech is on Exchange via Outlook). Confirm Outlook is running, or open it: `open -a "Microsoft Outlook"`.
2. **The template parses as an .eml.** Read the file — it should have `Subject:` and `Content-Type:` headers and a body. `.emltpl` files are raw email in quoted-printable; the plain-text body usually sits between lines 20–100 (see CLAUDE.md).
3. **No `{{tokens}}` without a matching CSV column.** Abort if any are missing.
4. **The `email` column contains values.** Sample a few rows for the presence of `@`.
5. **Attachments referenced exist.** If the template has embedded attachments or the CSV has an `attachments` column, the attachments folder must be passed and the referenced files must exist on disk.

## Common pitfalls

- **POSIX paths only.** AppleScript needs `/Users/...` not `~/...` — expand with `realpath` or by reading from PWD.
- **CSV with BOMs.** macOS Excel exports sometimes prefix with a UTF-8 BOM. Strip it before counting columns if the first header looks corrupted.
- **Subject containing `{{token}}`s.** These are replaced too — preview the subject for row 1 to make sure it reads cleanly.
- **Calendar invites masquerading as `.eml`.** If the template imports as an event/meeting instead of an outgoing message, re-export it from Outlook as an EML.
- **Test address bouncing.** If the test is to your own Exchange address, Outlook may suppress delivery to self. Use a non-Exchange address (e.g. a Gmail you control) for the test if the Exchange test doesn't arrive.

## What the skill must NEVER do

- Send without a successful test send first.
- Send without showing the user a row count and a row-1 subject preview.
- Modify the source CSV or template — it must read-only them.
- Drop the inter-send delay below 10 seconds without explicit user instruction.
