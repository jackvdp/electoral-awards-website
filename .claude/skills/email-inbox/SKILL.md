---
name: email-inbox
description: Email assistant for Jack's Exchange inbox. Reads mail in Apple Mail, walks through conversations, drafts replies in Apple Mail, and drafts new composes in Microsoft Outlook. Use when the user wants to triage their inbox, reply to messages, or send a new email.
argument-hint: [optional: number of emails, search term, or "next" to continue]
allowed-tools: Bash, Read, Write
---

# Email Assistant

An interactive email assistant for Jack's Exchange mailbox. Reads inbox messages via Apple Mail, walks the user through conversations, and drafts outgoing mail. **Never sends emails — only opens drafts for the user to review and send.**

## Tool split: Apple Mail vs Outlook

The skill uses **two mail clients** because of AppleScript constraints on macOS:

| Action | Client | Script |
|--------|--------|--------|
| **Read** inbox / fetch messages | Apple Mail | `fetch.sh` |
| **Reply** to a message (reply-all) | Apple Mail | `reply.sh` |
| **Compose** a new email | Microsoft Outlook | `compose.sh` |

Why the split: Apple Mail handles reading and replying cleanly (reply-all preserves the thread). Outlook handles new composes more reliably with rich HTML formatting. Use the right tool for each action.

---

## Workflow

### Step 1 — Fetch the inbox

Fetch all messages from the **Exchange** account inbox using the `fetch.sh` script:

```bash
# Fetch 30 most recent emails (default)
.claude/skills/email-inbox/fetch.sh

# Fetch a specific number
.claude/skills/email-inbox/fetch.sh --max 10

# Search by subject or sender
.claude/skills/email-inbox/fetch.sh --search "COMELEC"

# Paginate — skip the first 20, fetch the next 30
.claude/skills/email-inbox/fetch.sh --offset 20 --max 30
```

**Arguments:**
- `--max N` — maximum emails to fetch (default: 30)
- `--search "term"` — filter by subject or sender
- `--offset N` — skip the first N messages (for pagination)

### Step 2 — Group into conversations

After fetching, group emails into **conversations** by threading them together. Emails belong to the same conversation if they share a subject line (ignoring `Re:`, `FW:`, `Fwd:` prefixes) or are clearly part of the same exchange between the same participants.

Present a summary table of conversations first:

```
You have **N conversations** in your inbox:

| # | From | Subject | Messages | Latest |
|---|------|---------|----------|--------|
| 1 | name(s) | subject | count | date |
```

Then note which conversations likely need attention (e.g., unread, awaiting reply, action requested) and which are resolved/informational.

### Step 3 — Walk through conversations one at a time

Present **one conversation at a time**, showing:

```
**Conversation 1 of N**
**Subject:** Subject line
**Between:** Participant names
**Messages:** N emails (oldest date – newest date)

> Summary of the conversation thread — what was discussed, what was asked, where it stands now

**Latest message:**
**From:** Sender <email>
**Date:** Day, DD Month YYYY

> Body preview of the most recent message
```

Then ask:

> **What would you like to do?**
> - **Reply** — I'll draft a response to the latest message
> - **Skip** — move to the next conversation
> - **Read all** — show every message in this thread
> - **Search** — find a specific email
> - Or tell me what you'd like to say and I'll draft it

### Step 4 — Suggest and draft replies (Apple Mail via `reply.sh`)

When the user asks to reply (or says what they want to say):

1. **Read the full email** if only a preview was fetched — use the search flag on `fetch.sh`
2. **Suggest a response** — show the user a draft in a code block first, so they can review/edit before it goes into Mail
3. **Ask for confirmation** — "Shall I open this as a draft in Mail?"
4. **Open the draft** in Apple Mail using `reply.sh`

If the conversation clearly needs a response and the context is obvious, proactively suggest what the reply could say. If it's ambiguous, ask the user what they'd like to convey.

**Reply to the most recent message** in the conversation by default. If the user wants to reply to a specific earlier message, match by that sender instead.

**Prefer reply-all:** Always use `reply.sh` (which does reply-all) rather than starting a new compose, so existing recipients and thread context are preserved. The user can adjust recipients in Mail before sending.

**Adding recipients:** Only use `--cc` to add recipients whose email address you know for certain from the conversation. Never add placeholder addresses or guess email addresses — let the user sort those out.

### Step 5 — Draft a new email (Outlook via `compose.sh`)

When the user wants to start a **new conversation** (not a reply), or explicitly asks to "compose", "draft a new email", "email X with...", or similar:

1. Confirm recipients (To and any CC). If a recipient's address is unknown, ask before composing or pass `placeholder@example.com` and tell the user to swap it in.
2. **Suggest the draft text** in a code block first.
3. **Ask for confirmation** — "Open this in Outlook?"
4. **Open the draft** in Outlook using `compose.sh`. For anything with structure (lists, links, headings, bold), use `--html` (see below).

If asked to "open in Mail" without further context for a *new compose*, still use Outlook — that is the right tool for composes. Clarify if unsure.

### Step 6 — Style for drafts

- **Tone:** warm, courteous, understated British professional. Friendly without being effusive; gracious without being apologetic; direct without being blunt. Think of a well-mannered senior civil servant writing to a respected peer — polite, considered, and human. Allow small warmth cues ("it is lovely to hear from you", "warm regards from London") but avoid gushing, over-apologising, or corporate filler.
- British English throughout (e.g. "apologise", "organisation", "whilst", "favour").
- **No em dashes (—).** Use commas, full stops, semicolons, or parentheses instead. This applies to prose, HTML bodies, and HTML entities — do not use `&mdash;` either.
- Concise and focused — say the thing, then stop. One clear ask or message per email.
- Do NOT include a signature block of any kind: no name/title/organisation/phone/address lines and no closing sign-off name. End the body at "Kind regards," (or the relevant closing) and stop. Jack's signature is already configured in both Apple Mail and Outlook and is appended automatically; anything you add duplicates it.
- **Link to the event page** whenever an email invites someone to, or references, a webinar, roundtable, or awards event. Use the live event-page URL on `electoralnetwork.org` (e.g. `https://www.electoralnetwork.org/events/<id>`), embedded with `--html` as a hyperlink on descriptive text such as "the event page" or "full details", not a bare URL. Confirm the event ID with the user or the event's `.eml`/data file if you do not already have it.
- Start with "Dear [Name]," or "Hi [Name]," as appropriate; close with "Kind regards," (or "With kind regards," / "Warm regards from London," for warmer threads) and leave the configured signature to supply the name.

### Step 7 — Continue through the inbox

After each conversation is handled (replied or skipped), move to the next one. Keep a running count so the user knows their progress.

If the user says "skip all" or "just show me the list", present the summary table again.

---

## Scripts

All scripts are in `.claude/skills/email-inbox/`.

| Script | Purpose | Mail client |
|--------|---------|-------------|
| `fetch.sh` | Fetch inbox emails (with optional search, pagination) | Apple Mail |
| `reply.sh` | Open a reply-all draft | Apple Mail |
| `compose.sh` | Open a new compose draft | Microsoft Outlook |

### Get the full email body

To read the full body of a specific email, use the search flag:

```bash
.claude/skills/email-inbox/fetch.sh --search "sender@example.com" --max 1
```

### Reply to an email — `reply.sh` (Apple Mail)

Use the `reply.sh` bash script. It wraps the AppleScript and accepts arguments, so you never need to write AppleScript inline.

**Usage:**

```bash
# Basic reply (always reply-all to preserve CC recipients)
.claude/skills/email-inbox/reply.sh \
  --sender "email@example.com" \
  --body "Dear X,

Thank you for your email.

"

# Reply with CC
.claude/skills/email-inbox/reply.sh \
  --sender "email@example.com" \
  --body "Dear X,

Thank you for your email.

" \
  --cc "colleague@example.com"

# Multiple CC recipients
.claude/skills/email-inbox/reply.sh \
  --sender "email@example.com" \
  --body "Dear X, ..." \
  --cc "person1@example.com" \
  --cc "person2@example.com"
```

**Arguments:**
- `--sender` (required) — email address or name to match the message to reply to
- `--body` (required) — the reply text to paste into the message (supports multiline)
- `--cc` (optional, repeatable) — CC recipient email address
- `--html` (optional) — treat `--body` as HTML content, enabling rich text with clickable links, bold, etc.

**Use `--html` mode** when the body contains links. Wrap the body in a `<div>` with paragraphs (`<p>`) and use `<a href='...'>` for links. Example:

```bash
.claude/skills/email-inbox/reply.sh \
  --sender "email@example.com" \
  --html \
  --body "<div><p>Dear X,</p><p>Please visit <a href='https://electoralnetwork.org'>electoralnetwork.org</a> for details.</p></div>"
```

**How it works under the hood:**
- Generates a temporary AppleScript at `/tmp/mail-reply.applescript`
- Opens a reply window in Apple Mail on the Exchange account
- Adds any CC recipients
- Uses `Cmd+Up` to move cursor to top (preserving the thread)
- Pastes the body text via the clipboard
- **Never sends** — only opens the draft

**IMPORTANT constraints (baked into the script):**
- Do NOT set the `content` property of the reply — this overwrites the thread
- Do NOT use `Cmd+A` — this can select and replace the thread
- Uses `delay 2` to let the reply window fully load before pasting

### Compose a new email — `compose.sh` (Outlook)

Use the `compose.sh` bash script for **new emails** (not replies). It opens a draft in Microsoft Outlook.

**Usage:**

```bash
# Basic new compose
.claude/skills/email-inbox/compose.sh \
  --to "tracy.drewett@parlicentre.co.uk" \
  --subject "Updated comms plan" \
  --body "Hi Tracy,

Quick note...

Jack
"

# Multiple recipients + CC
.claude/skills/email-inbox/compose.sh \
  --to "tracy.drewett@parlicentre.co.uk" \
  --to "cnithoo@parlistudies.org" \
  --cc "colleague@example.com" \
  --subject "Subject" \
  --body "Body..."

# Recipient unknown — use placeholder, tell user to swap it in
.claude/skills/email-inbox/compose.sh \
  --to "placeholder@example.com" \
  --subject "..." \
  --body "..."
```

**Arguments:**
- `--to` (required, repeatable) — recipient email address
- `--subject` (required) — email subject line
- `--body` (required) — email body (plain text or HTML, see below)
- `--cc` (optional, repeatable) — CC recipient
- `--html` (optional) — treat `--body` as HTML

#### HTML formatting in Outlook composes

**Always use `--html`** for any email with structure: lists, links, bold/italic, headings. Outlook's `content` property is HTML, so plain-text bullets ("- item") and manual line breaks do NOT survive as structure — a "-" list in plain text renders as one run-on paragraph. Real structure needs real tags: `<ul><li>`, `<p>`, `<b>`, `<a>`.

(Plain-text mode is safe for simple prose: `compose.sh` converts newlines to `<br>` so paragraphs and blank lines are preserved. But it never produces proper bullets or bold — use `--html` for those.)

The script wraps your `--body` in this shell:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <style>p { margin: 0; }</style>
</head>
<body style='font-family: Calibri, Arial, sans-serif; font-size: 15px;'>
  <!-- your --body goes here -->
</body>
</html>
```

So you only need to supply the **inner HTML** for the body. Use:

- `<p>...</p>` for paragraphs. **The wrapper sets `p { margin: 0; }`, so consecutive `<p>` siblings render with NO gap between them and the email looks like one cramped block.** To get proper spacing, put an explicit blank-line paragraph `<p>&nbsp;</p>` between every visible paragraph. Treat this as the default for any multi-paragraph email (delegate briefings, formal notices), not an optional extra.
- `<b>...</b>` or `<strong>...</strong>` for bold
- `<i>...</i>` or `<em>...</em>` for italic
- `<ol><li><p>...</p></li>...</ol>` for numbered lists (wrap list item content in `<p>` to keep spacing consistent)
- `<ul><li><p>...</p></li>...</ul>` for bullet lists
- `<a href='https://...'>link text</a>` for links (use single quotes inside HTML attributes to avoid AppleScript escape issues)
- `<br>` for a soft line break inside a paragraph
- `&amp;` for `&`, `&lt;` and `&gt;` for angle brackets, `&nbsp;` for non-breaking space
- **Never** use `&mdash;` or `—`. Use commas, full stops, semicolons, or parentheses instead. Use a hyphen `-` only if a separator is genuinely needed.

**Quote handling:** the body is wrapped in double quotes when passed to AppleScript. Use **single quotes** inside HTML attributes (`href='...'`, `style='...'`) so you do not need to escape them.

**Example — a structured Outlook compose with HTML:**

```bash
.claude/skills/email-inbox/compose.sh \
  --to "tracy.drewett@parlicentre.co.uk" \
  --subject "Awards categories, proposed revamp" \
  --html \
  --body "<p>Hi Tracy,</p>
<p>Quick proposal on the awards categories. New slate of 10 below:</p>
<ol>
<li><p><b>International Electoral Cooperation Award</b>, renamed from International Institutional Engagement.</p></li>
<li><p><b>Electoral Conflict Management Award</b>, unchanged.</p></li>
<li><p><b>Voter-Centred Design Award</b>, renamed from Electoral Ergonomy.</p></li>
</ol>
<p>Full details at <a href='https://electoralnetwork.org/admin/comms-plan'>the comms plan dashboard</a>.</p>
<p>Jack</p>"
```

**How `compose.sh` works under the hood:**
- Generates a temporary AppleScript at `/tmp/outlook-compose.applescript`
- Tells Outlook to create a new outgoing message with subject, body, To, and CC set as properties
- Opens the draft window (`open newMessage`) and activates Outlook
- **Never sends** — only opens the draft

---

## Template: pre-event speaker briefing (logistics email to speakers)

For the logistics email sent to a webinar's confirmed speakers about a week before the event (thanks, bio and slides requests, agenda with per-speaker timings, Zoom details, contact number), use the template at `.claude/skills/email-inbox/templates/speaker-briefing.md`. Read that file and substitute its bracketed fields; compose via `compose.sh` with `--html`.

---

## Template: pre-event delegate briefing (joining details)

Use this for the joining-instructions email sent to registered delegates ahead of a webinar or roundtable. It is usually sent the day before the event by the admin team (e.g. Devianee, `cnithoo@parlistudies.org`), so compose it to whoever sends it out, addressed to the delegate. Note the blank-line `<p>&nbsp;</p>` paragraphs throughout to keep the spacing right in Outlook.

Substitute the bracketed fields: event title, date, speaker list (name, title, organisation, one per line), start time and recommended join time, Zoom join link, Meeting ID, Passcode, and the event-page URL.

```bash
.claude/skills/email-inbox/compose.sh \
  --to "cnithoo@parlistudies.org" \
  --subject "Joining details: [EVENT TITLE] ([DATE])" \
  --html \
  --body "<p>Dear Delegate,</p>
<p>&nbsp;</p>
<p>Thank you for registering to attend the International Centre for Parliamentary Studies (ICPS) webinar: <b>[EVENT TITLE]</b>, taking place [DAY DATE]. This webinar is hosted online via Zoom.</p>
<p>&nbsp;</p>
<p>We are delighted to confirm the following speakers:</p>
<p>&nbsp;</p>
<p>[Speaker Name], [Title], [Organisation]<br>
[Speaker Name], [Title], [Organisation]</p>
<p>&nbsp;</p>
<p>The event starts at [START TIME] BST (UTC+1), but as a caveat we advise that you join using the link provided at [JOIN TIME] BST, as this will allow us to iron out any potential IT issues before the agenda starts.</p>
<p>&nbsp;</p>
<p>Below are the details you will require in order to join. The link is already active, but you will be unable to join the room until the session starts.</p>
<p>&nbsp;</p>
<p><b>Topic:</b> [EVENT TITLE]<br>
<b>Time:</b> [DAY DATE], [START TIME] BST (UTC+1)</p>
<p>&nbsp;</p>
<p><b>Join Zoom Meeting:</b> <a href='[ZOOM JOIN LINK]'>click here</a></p>
<p>&nbsp;</p>
<p>Meeting ID: [MEETING ID]<br>
Passcode: [PASSCODE]</p>
<p>&nbsp;</p>
<p>For the full programme and session details, please see our event page: <a href='[EVENT PAGE URL]'>click here</a></p>
<p>&nbsp;</p>
<p>I will be present throughout the entire event to assist with any technical issues that may arise.</p>
<p>&nbsp;</p>
<p>If you have any questions, please do not hesitate to ask.</p>
<p>&nbsp;</p>
<p>Kind regards,</p>"
```

Notes:
- A speaker line can also describe a partner or product rather than a person, e.g. `NOMOS, a news, content, and connection layer built specifically for electoral bodies.`
- Confirm with the user when the email will actually be sent before using "tomorrow"; default to the explicit date if there is any doubt.
- The recommended join time is normally 15 minutes before the start.

---

## Key Rules

1. **NEVER send an email.** Only open draft windows for the user to review and send manually.
2. **Always use the Exchange account** — `account "Exchange"`, mailbox `"Inbox"` (handled by the scripts).
3. **Replies → Apple Mail via `reply.sh`. New composes → Outlook via `compose.sh`.** Do not mix.
4. **Do not include a signature or a closing sign-off name** in drafted emails — end at "Kind regards," and stop. Jack's full signature is configured in both clients and is appended automatically; adding one duplicates it.
5. **Always reply all** — `reply.sh` uses `reply to all` so existing CC recipients are preserved. Use `--cc` only for *additional* recipients not already on the thread.
6. **Preserve the email thread** in replies — use the clipboard-paste method with `Cmd+Up` then `Cmd+V`. Never use `set content of` (overwrites thread). Never use `Cmd+A` (selects and can replace thread).
7. **Use `delay 2`** after `reply msg opening window yes with reply to all` — gives the reply window time to fully load before pasting.
8. **Show the draft text to the user first** in a code block before opening it in Mail or Outlook, so they can request changes.
9. **Match sender by email address** for precision when replying (e.g., `"Caroline.Fawkes@vi.gov"` not just `"Caroline"`).
10. **British English** throughout all drafted responses, in the warm-but-understated tone described in "Style for drafts". **Never use em dashes (—)** in drafts — use commas, full stops, or parentheses instead.
11. **Use `--html` in Outlook composes** for anything with structure (lists, links, bold, headings). Plain-text "-" bullets render as one run-on paragraph in Outlook; bulleted emails must use `<ul><li><p>...</p></li></ul>`. Plain-text mode preserves paragraphs and blank lines only.
12. **Link to the event page** in any email that invites someone to or references a webinar, roundtable, or awards event — embed the live `electoralnetwork.org/events/<id>` URL as a hyperlink on descriptive text (e.g. "the event page"), never a bare URL.

## Notes

- Apple Mail and Outlook must be running (or will be launched by the relevant script).
- The first run of either may trigger a macOS permission prompt for Terminal to control the app.
- For very large inboxes, keep `--max` reasonable to avoid slow execution.
- If a script times out, reduce `--max` or skip body content extraction.
