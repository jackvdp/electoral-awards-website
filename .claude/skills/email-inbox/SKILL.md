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
- Do NOT include a signature block — Jack's signature is already configured in both Apple Mail and Outlook.
- Start with "Dear [Name]," or "Hi [Name]," as appropriate; sign off with "Jack" (or "With kind regards, Jack" / "Warm regards from London, Jack" for warmer threads).

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
  --cc "s.ramsurrun@parlistudies.org"

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
  --cc "s.ramsurrun@parlistudies.org" \
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

**Always use `--html`** for any email with structure: lists, links, bold/italic, multiple paragraphs that need spacing. Plain text composes in Outlook can look like one ugly block.

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

- `<p>...</p>` for paragraphs (margin is reset, so use empty `<p>&nbsp;</p>` for blank lines if needed, though usually `<p>` siblings are enough)
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

## Key Rules

1. **NEVER send an email.** Only open draft windows for the user to review and send manually.
2. **Always use the Exchange account** — `account "Exchange"`, mailbox `"Inbox"` (handled by the scripts).
3. **Replies → Apple Mail via `reply.sh`. New composes → Outlook via `compose.sh`.** Do not mix.
4. **Do not include a signature** in drafted emails — Jack's signature is already configured in both clients.
5. **Always reply all** — `reply.sh` uses `reply to all` so existing CC recipients are preserved. Use `--cc` only for *additional* recipients not already on the thread.
6. **Preserve the email thread** in replies — use the clipboard-paste method with `Cmd+Up` then `Cmd+V`. Never use `set content of` (overwrites thread). Never use `Cmd+A` (selects and can replace thread).
7. **Use `delay 2`** after `reply msg opening window yes with reply to all` — gives the reply window time to fully load before pasting.
8. **Show the draft text to the user first** in a code block before opening it in Mail or Outlook, so they can request changes.
9. **Match sender by email address** for precision when replying (e.g., `"Caroline.Fawkes@vi.gov"` not just `"Caroline"`).
10. **British English** throughout all drafted responses, in the warm-but-understated tone described in "Style for drafts". **Never use em dashes (—)** in drafts — use commas, full stops, or parentheses instead.
11. **CC Swastee Ramsurrun** (`s.ramsurrun@parlistudies.org`) on all emails relating to electoral administration, delegate matters, awards logistics, COMELEC coordination, or Network operations.
12. **Use `--html` in Outlook composes** for anything with structure (lists, links, bold, multiple paragraphs that need spacing). Plain text composes can render as one ugly block.

## Notes

- Apple Mail and Outlook must be running (or will be launched by the relevant script).
- The first run of either may trigger a macOS permission prompt for Terminal to control the app.
- For very large inboxes, keep `--max` reasonable to avoid slow execution.
- If a script times out, reduce `--max` or skip body content extraction.
