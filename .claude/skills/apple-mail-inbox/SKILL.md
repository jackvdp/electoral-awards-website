---
name: apple-mail-inbox
description: Email assistant for Apple Mail. Reads the Exchange inbox, presents emails one by one, suggests and drafts replies. Use when the user wants to go through their emails, triage their inbox, or reply to messages in Apple Mail.
argument-hint: [optional: number of emails, search term, or "next" to continue]
allowed-tools: Bash, Read, Write
---

# Email Assistant

An interactive email assistant that reads the Exchange mailbox in Apple Mail, walks through emails one by one, and drafts replies on request. **Never sends emails — only opens drafts for the user to review and send.**

## Workflow

### Step 1 — Fetch the inbox

Fetch all messages from the **Exchange** account inbox. Write the following to `/tmp/apple-mail-inbox.applescript` and run with `osascript`:

```applescript
set maxCount to 30
set output to ""
set delimChar to ASCII character 30

tell application "Mail"
    set exchangeAccount to account "Exchange"
    set inboxMailbox to mailbox "Inbox" of exchangeAccount
    set inboxMessages to messages of inboxMailbox
    set msgCount to count of inboxMessages
    if msgCount > maxCount then set msgCount to maxCount

    repeat with i from 1 to msgCount
        set msg to item i of inboxMessages
        set msgFrom to sender of msg
        set msgSubject to subject of msg
        set msgDate to date received of msg
        set msgRead to read status of msg
        set msgContent to content of msg

        if (count of msgContent) > 500 then
            set msgContent to text 1 thru 500 of msgContent
        end if

        set output to output & "FROM: " & msgFrom & linefeed
        set output to output & "SUBJECT: " & msgSubject & linefeed
        set output to output & "DATE: " & (msgDate as string) & linefeed
        set output to output & "READ: " & (msgRead as string) & linefeed
        set output to output & "BODY: " & msgContent & linefeed
        set output to output & delimChar & linefeed
    end repeat
end tell

return output
```

### Step 2 — Present emails one at a time

Show the user **one email at a time**, formatted as:

```
**Email 1 of N**
**From:** Sender Name <email>
**Date:** Day, DD Month YYYY
**Subject:** Subject line

> Body preview (first few lines, quoted)
```

Then ask:

> **What would you like to do?**
> - **Reply** — I'll draft a response for you
> - **Skip** — move to the next email
> - **Search** — find a specific email
> - Or tell me what you'd like to say and I'll draft it

### Step 3 — Suggest and draft replies

When the user asks to reply (or says what they want to say):

1. **Read the full email** if only a preview was fetched — use the "Get Full Email Body" template below
2. **Suggest a response** — show the user a draft in a code block first, so they can review/edit before it goes into Mail
3. **Ask for confirmation** — "Shall I open this as a draft in Mail?"
4. **Open the draft** in Apple Mail using the reply template below

If the email clearly needs a response and the context is obvious, proactively suggest what the reply could say. If it's ambiguous, ask the user what they'd like to convey.

**Style for drafts:**
- Professional, warm, concise — matching Jack's tone
- British English throughout
- Do NOT include a signature block — Jack's signature is already in Mail
- Start with "Dear [Name]," or "Hi [Name]," as appropriate
- Keep replies focused and to the point

### Step 4 — Continue through the inbox

After each email is handled (replied or skipped), move to the next one. Keep a running count so the user knows their progress.

If the user says "skip all" or "just show me the list", present a summary table instead:

| # | From | Subject | Date |
|---|------|---------|------|
| 1 | name | subject | date |

---

## AppleScript Templates

### Get Full Email Body

```applescript
tell application "Mail"
    set exchangeAccount to account "Exchange"
    set inboxMailbox to mailbox "Inbox" of exchangeAccount
    set inboxMessages to messages of inboxMailbox

    repeat with msg in inboxMessages
        if sender of msg contains "SENDER_MATCH" then
            set msgFrom to sender of msg
            set msgSubject to subject of msg
            set msgDate to date received of msg
            set msgContent to content of msg
            return "FROM: " & msgFrom & linefeed & "SUBJECT: " & msgSubject & linefeed & "DATE: " & (msgDate as string) & linefeed & "BODY: " & msgContent
        end if
    end repeat
end tell

return "No message found."
```

### Reply to an Email — `reply.sh`

Use the `reply.sh` bash script located alongside this skill file. It wraps the AppleScript and accepts arguments, so you never need to write AppleScript inline.

**Usage:**

```bash
# Basic reply
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

### Search Messages

```applescript
set searchTerm to "SEARCH_TERM_HERE"
set maxCount to 50
set output to ""
set delimChar to ASCII character 30

tell application "Mail"
    set exchangeAccount to account "Exchange"
    set inboxMailbox to mailbox "Inbox" of exchangeAccount
    set inboxMessages to messages of inboxMailbox
    set msgCount to count of inboxMessages
    if msgCount > maxCount then set msgCount to maxCount

    repeat with i from 1 to msgCount
        set msg to item i of inboxMessages
        set msgFrom to sender of msg
        set msgSubject to subject of msg

        if msgSubject contains searchTerm or msgFrom contains searchTerm then
            set msgDate to date received of msg
            set msgRead to read status of msg
            set msgContent to content of msg

            if (count of msgContent) > 500 then
                set msgContent to text 1 thru 500 of msgContent
            end if

            set output to output & "FROM: " & msgFrom & linefeed
            set output to output & "SUBJECT: " & msgSubject & linefeed
            set output to output & "DATE: " & (msgDate as string) & linefeed
            set output to output & "READ: " & (msgRead as string) & linefeed
            set output to output & "BODY: " & msgContent & linefeed
            set output to output & delimChar & linefeed
        end if
    end repeat
end tell

return output
```

---

## Key Rules

1. **NEVER send an email.** Only open draft reply windows for the user to review and send manually.
2. **Always use the Exchange account** — `account "Exchange"`, mailbox `"Inbox"`.
3. **Do not include a signature** in drafted replies — Jack's signature is already configured in Mail.
4. **Preserve the email thread** — use the clipboard-paste method with `Cmd+Up` then `Cmd+V`. Never use `set content of` (overwrites thread). Never use `Cmd+A` (selects and can replace thread).
5. **Use `delay 2`** after `reply msg opening window yes` — gives the reply window time to fully load before pasting.
6. **Show the draft text to the user first** in a code block before opening it in Mail, so they can request changes.
7. **Match sender by email address** for precision when replying (e.g., `"Caroline.Fawkes@vi.gov"` not just `"Caroline"`).
8. **British English** throughout all drafted responses.
9. **CC Swastee Ramsurrun** (`s.ramsurrun@parlistudies.org`) on all emails relating to electoral administration, delegate matters, awards logistics, COMELEC coordination, or Network operations. Use the "Reply with CC Recipients" template for these.

## Notes

- Apple Mail must be running (or will be launched by the script)
- The first run may trigger a macOS permission prompt for Terminal to control Mail
- Body content is plain text; HTML formatting is stripped
- For very large inboxes, keep maxCount reasonable to avoid slow execution
- If the script times out, reduce maxCount or skip body content extraction