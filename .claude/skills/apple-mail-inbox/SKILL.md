---
name: apple-mail-inbox
description: Email assistant for Apple Mail. Reads the Exchange inbox, presents emails one by one, suggests and drafts replies. Use when the user wants to go through their emails, triage their inbox, or reply to messages in Apple Mail.
argument-hint: [optional: number of emails, search term, or "next" to continue]
allowed-tools: Bash, Read, Write
---

# Email Assistant

An interactive email assistant that reads the Exchange mailbox in Apple Mail, groups emails into conversations, and walks through them conversation by conversation. Drafts replies on request. **Never sends emails — only opens drafts for the user to review and send.**

## Workflow

### Step 1 — Fetch the inbox

Fetch all messages from the **Exchange** account inbox using the `fetch.sh` script:

```bash
# Fetch 30 most recent emails (default)
.claude/skills/apple-mail-inbox/fetch.sh

# Fetch a specific number
.claude/skills/apple-mail-inbox/fetch.sh --max 10

# Search by subject or sender
.claude/skills/apple-mail-inbox/fetch.sh --search "COMELEC"

# Paginate — skip the first 20, fetch the next 30
.claude/skills/apple-mail-inbox/fetch.sh --offset 20 --max 30
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

### Step 4 — Suggest and draft replies

When the user asks to reply (or says what they want to say):

1. **Read the full email** if only a preview was fetched — use the search flag on `fetch.sh`
2. **Suggest a response** — show the user a draft in a code block first, so they can review/edit before it goes into Mail
3. **Ask for confirmation** — "Shall I open this as a draft in Mail?"
4. **Open the draft** in Apple Mail using `reply.sh`

If the conversation clearly needs a response and the context is obvious, proactively suggest what the reply could say. If it's ambiguous, ask the user what they'd like to convey.

**Reply to the most recent message** in the conversation by default. If the user wants to reply to a specific earlier message, match by that sender instead.

**Style for drafts:**
- Professional, warm, concise — matching Jack's tone
- British English throughout
- Do NOT include a signature block — Jack's signature is already in Mail
- Start with "Dear [Name]," or "Hi [Name]," as appropriate
- Keep replies focused and to the point

### Step 5 — Continue through the inbox

After each conversation is handled (replied or skipped), move to the next one. Keep a running count so the user knows their progress.

If the user says "skip all" or "just show me the list", present the summary table again.

---

## Scripts

All scripts are in `.claude/skills/apple-mail-inbox/`.

| Script | Purpose |
|--------|---------|
| `fetch.sh` | Fetch inbox emails (with optional search, pagination) |
| `reply.sh` | Open a reply-all draft in Apple Mail (with optional additional CC) |

### Get Full Email Body

To read the full body of a specific email, use the search flag:

```bash
.claude/skills/apple-mail-inbox/fetch.sh --search "sender@example.com" --max 1
```

### Reply to an Email — `reply.sh`

Use the `reply.sh` bash script located alongside this skill file. It wraps the AppleScript and accepts arguments, so you never need to write AppleScript inline.

**Usage:**

```bash
# Basic reply (always reply-all to preserve CC recipients)
.claude/skills/apple-mail-inbox/reply.sh \
  --sender "email@example.com" \
  --body "Dear X,

Thank you for your email.

"

# Reply with CC
.claude/skills/apple-mail-inbox/reply.sh \
  --sender "email@example.com" \
  --body "Dear X,

Thank you for your email.

" \
  --cc "s.ramsurrun@parlistudies.org"

# Multiple CC recipients
.claude/skills/apple-mail-inbox/reply.sh \
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

**Always use `--html` mode** when the body contains links. Wrap the body in a `<div>` with paragraphs (`<p>`) and use `<a href='...'>` for links. Example:

```bash
.claude/skills/apple-mail-inbox/reply.sh \
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

---

## Key Rules

1. **NEVER send an email.** Only open draft reply windows for the user to review and send manually.
2. **Always use the Exchange account** — `account "Exchange"`, mailbox `"Inbox"`.
3. **Do not include a signature** in drafted replies — Jack's signature is already configured in Mail.
4. **Always reply all** — the script uses `reply to all` so existing CC recipients are preserved. Use `--cc` only for *additional* recipients not already on the thread.
5. **Preserve the email thread** — use the clipboard-paste method with `Cmd+Up` then `Cmd+V`. Never use `set content of` (overwrites thread). Never use `Cmd+A` (selects and can replace thread).
6. **Use `delay 2`** after `reply msg opening window yes with reply to all` — gives the reply window time to fully load before pasting.
7. **Show the draft text to the user first** in a code block before opening it in Mail, so they can request changes.
8. **Match sender by email address** for precision when replying (e.g., `"Caroline.Fawkes@vi.gov"` not just `"Caroline"`).
9. **British English** throughout all drafted responses.
10. **CC Swastee Ramsurrun** (`s.ramsurrun@parlistudies.org`) on all emails relating to electoral administration, delegate matters, awards logistics, COMELEC coordination, or Network operations. Use the "Reply with CC Recipients" template for these.

## Notes

- Apple Mail must be running (or will be launched by the script)
- The first run may trigger a macOS permission prompt for Terminal to control Mail
- Body content is plain text; HTML formatting is stripped
- For very large inboxes, keep maxCount reasonable to avoid slow execution
- If the script times out, reduce maxCount or skip body content extraction