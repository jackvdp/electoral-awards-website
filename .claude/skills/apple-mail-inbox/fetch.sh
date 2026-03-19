#!/bin/bash
# Fetch emails from Apple Mail (Exchange inbox)
# Usage: ./fetch.sh [--max N] [--search "term"] [--offset N]
#
# Arguments:
#   --max     Maximum number of emails to fetch (default: 30)
#   --search  Filter by subject or sender containing this term (optional)
#   --offset  Skip the first N messages (default: 0, i.e. start from most recent)

MAX=30
SEARCH=""
OFFSET=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        --max)
            MAX="$2"
            shift 2
            ;;
        --search)
            SEARCH="$2"
            shift 2
            ;;
        --offset)
            OFFSET="$2"
            shift 2
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [[ -n "$SEARCH" ]]; then
    cat > /tmp/apple-mail-inbox.applescript << APPLESCRIPT
set searchTerm to "$SEARCH"
set maxCount to $MAX
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
APPLESCRIPT
else
    START_INDEX=$((OFFSET + 1))
    cat > /tmp/apple-mail-inbox.applescript << APPLESCRIPT
set startIndex to $START_INDEX
set maxCount to $((OFFSET + MAX))
set output to ""
set delimChar to ASCII character 30

tell application "Mail"
    set exchangeAccount to account "Exchange"
    set inboxMailbox to mailbox "Inbox" of exchangeAccount
    set inboxMessages to messages of inboxMailbox
    set msgCount to count of inboxMessages
    if msgCount > maxCount then set msgCount to maxCount

    repeat with i from startIndex to msgCount
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
APPLESCRIPT
fi

osascript /tmp/apple-mail-inbox.applescript
