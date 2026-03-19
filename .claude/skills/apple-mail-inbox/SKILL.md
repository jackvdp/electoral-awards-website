---
name: apple-mail-inbox
description: Read emails from Apple Mail inbox and reply to them using AppleScript. Returns sender, subject, date, and body for recent messages. Can also draft replies that preserve the email thread. Use when the user wants to check, search, review, or reply to emails in Apple Mail.
argument-hint: [optional: number of emails to fetch, search term, or "reply" to respond to an email]
allowed-tools: Bash, Read, Write
---

# Apple Mail Inbox Reader & Reply

Fetches emails from the user's Apple Mail inbox using AppleScript via `osascript`.

## How It Works

1. Build an AppleScript that queries Apple Mail for inbox messages
2. Write the script to `/tmp/apple-mail-inbox.applescript`
3. Execute with `osascript /tmp/apple-mail-inbox.applescript`
4. Parse and present the results

## Default Behaviour

Fetch the **20 most recent** inbox messages, returning for each:
- **From** (sender name + email)
- **Subject**
- **Date received**
- **Read/unread** status
- **Body preview** (first 300 characters)

If the user provides a number, fetch that many instead. If they provide a search term, filter by subject or sender.

## AppleScript Templates

### Fetch Recent Messages

Write the following to `/tmp/apple-mail-inbox.applescript` and execute with `osascript`:

```applescript
set maxCount to 20
set output to ""
set delimChar to ASCII character 30 -- record separator

tell application "Mail"
    set inboxMessages to messages of inbox
    set msgCount to count of inboxMessages
    if msgCount > maxCount then set msgCount to maxCount

    repeat with i from 1 to msgCount
        set msg to item i of inboxMessages
        set msgFrom to sender of msg
        set msgSubject to subject of msg
        set msgDate to date received of msg
        set msgRead to read status of msg
        set msgContent to content of msg

        -- Truncate body to 300 chars
        if (count of msgContent) > 300 then
            set msgContent to text 1 thru 300 of msgContent
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

### Search Messages by Subject or Sender

To search, modify the repeat block to include a filter:

```applescript
set searchTerm to "SEARCH_TERM_HERE"
set maxCount to 50
set matchCount to 0
set output to ""
set delimChar to ASCII character 30

tell application "Mail"
    set inboxMessages to messages of inbox
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

            if (count of msgContent) > 300 then
                set msgContent to text 1 thru 300 of msgContent
            end if

            set output to output & "FROM: " & msgFrom & linefeed
            set output to output & "SUBJECT: " & msgSubject & linefeed
            set output to output & "DATE: " & (msgDate as string) & linefeed
            set output to output & "READ: " & (msgRead as string) & linefeed
            set output to output & "BODY: " & msgContent & linefeed
            set output to output & delimChar & linefeed

            set matchCount to matchCount + 1
        end if
    end repeat
end tell

return output
```

### Get Full Email Body

To read a complete email (when the user wants the full content of a specific message):

```applescript
set targetSubject to "SUBJECT_HERE"

tell application "Mail"
    set inboxMessages to messages of inbox
    repeat with msg in inboxMessages
        if subject of msg is targetSubject then
            set msgFrom to sender of msg
            set msgDate to date received of msg
            set msgContent to content of msg
            return "FROM: " & msgFrom & linefeed & "DATE: " & (msgDate as string) & linefeed & "BODY: " & msgContent
        end if
    end repeat
end tell

return "No message found with that subject."
```

## Execution Steps

1. Choose the appropriate template based on the user's request
2. Write the AppleScript to `/tmp/apple-mail-inbox.applescript`
3. Run: `osascript /tmp/apple-mail-inbox.applescript`
4. If output is very large, redirect to file: `osascript /tmp/apple-mail-inbox.applescript > /tmp/mail-output.txt` then read the file
5. Parse the output and present it in a clean, readable format (table or list)

## Presentation

Present results as a markdown table when listing multiple emails:

| # | From | Subject | Date | Read |
|---|------|---------|------|------|
| 1 | sender | subject | date | Yes/No |

Include body previews below the table only if the user asks, or if there are fewer than 5 results.

## Replying to an Email

To reply to an email, use the clipboard-paste approach. This preserves the original thread in the reply window.

**IMPORTANT:** Do NOT set the `content` property of the reply message — this overwrites the entire thread. Instead, open the reply window, copy the draft to the clipboard, and paste it in using System Events keystrokes.

Write the following to `/tmp/mail-reply.applescript` and execute with `osascript`:

```applescript
set replyBody to "DRAFT_TEXT_HERE

"

tell application "Mail"
    set targetAccount to account "ACCOUNT_NAME"
    set inboxMailbox to mailbox "Inbox" of targetAccount
    set inboxMessages to messages of inboxMailbox

    repeat with msg in inboxMessages
        if sender of msg contains "SENDER_MATCH" then
            reply msg opening window yes
            delay 1
            activate
            exit repeat
        end if
    end repeat
end tell

set the clipboard to replyBody

tell application "System Events"
    tell process "Mail"
        keystroke "a" using {command down}
        key code 123 -- left arrow to deselect and move cursor to start
        keystroke "v" using {command down}
    end tell
end tell
```

### Key Points for Replies

- Match the sender using `sender of msg contains "email_or_name"` — use the email address for precision
- The `delay 1` after `reply msg opening window yes` is essential — it lets the reply window fully load before pasting
- The trailing newlines after `replyBody` add spacing between the draft and the quoted thread
- Always use the clipboard + System Events paste approach, never `set content of`
- The user's accounts are: **Personal**, **Pumpy**, **Tech**, **Exchange** — ask which account if unclear
- The Exchange inbox mailbox is called `"Inbox"` (capital I)
- Include Jack's standard signature block in replies (see outlook-email skill for format)
- Never auto-send — always open the compose window for user review

## Notes

- Apple Mail must be running (or will be launched by the script)
- The first run may trigger a macOS permission prompt — the user must allow Terminal/iTerm to control Mail
- Body content is plain text extracted from the message; HTML formatting is stripped
- For very large inboxes, keep maxCount reasonable (default 20) to avoid slow execution
- If the script times out, reduce maxCount or skip body content extraction