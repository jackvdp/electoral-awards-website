#!/bin/bash
# Search and browse Apple Mail mailboxes on the Exchange account (work mail).
# Deliberately scoped to the Exchange account only — personal accounts
# (Personal, Pumpy, Tech) are never touched.
#
# Usage:
#   ./mailboxes.sh --list [--filter "term"]
#       List all Exchange mailboxes with their full nested path and message
#       count. Optional --filter matches mailbox names (case-sensitive).
#
#   ./mailboxes.sh --mailbox "Name" [--search "term"] [--max N] [--preview|--full]
#       Browse or search a mailbox by NAME (no path needed — nested mailboxes
#       such as "Awards 26" under "Electoral" are found automatically; every
#       mailbox with that name is covered). Without --search, shows the most
#       recent messages. --search matches subject or sender.
#
# Output detail:
#   default    headers only (FROM / SUBJECT / DATE) — fast, use for scanning
#   --preview  adds the first 300 characters of each body
#   --full     adds the first 3000 characters of each body
#
# Notes:
#   - "Sent Items" and "Deleted Items" hold 10k–25k messages: always pair them
#     with --search, never browse them bare.
#   - Searching uses a fast Mail query first and falls back to scanning the
#     300 most recent messages if the query fails.

MODE=""
MAILBOX=""
SEARCH=""
FILTER=""
MAX=20
BODYCHARS=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        --list)
            MODE="list"
            shift
            ;;
        --mailbox)
            MODE="mailbox"
            MAILBOX="$2"
            shift 2
            ;;
        --search)
            SEARCH="$2"
            shift 2
            ;;
        --filter)
            FILTER="$2"
            shift 2
            ;;
        --max)
            MAX="$2"
            shift 2
            ;;
        --preview)
            BODYCHARS=300
            shift
            ;;
        --full)
            BODYCHARS=3000
            shift
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [[ "$MODE" == "list" ]]; then
    cat > /tmp/email-mailboxes.applescript << APPLESCRIPT
set filterTerm to "$FILTER"
set output to ""

tell application "Mail"
    set acct to account "Exchange"
    repeat with mb in mailboxes of acct
        try
            set mbName to name of mb
            if filterTerm is "" or mbName contains filterTerm then
                set pathStr to mbName
                set parentBox to mb
                repeat
                    try
                        set parentBox to container of parentBox
                        set parentName to name of parentBox
                        if parentName is missing value then exit repeat
                        set pathStr to parentName & "/" & pathStr
                    on error
                        exit repeat
                    end try
                end repeat
                set output to output & pathStr & " | " & (count of messages of mb) & " msgs" & linefeed
            end if
        end try
    end repeat
end tell

return output
APPLESCRIPT

elif [[ "$MODE" == "mailbox" ]]; then
    cat > /tmp/email-mailboxes.applescript << APPLESCRIPT
set targetName to "$MAILBOX"
set searchTerm to "$SEARCH"
set maxCount to $MAX
set bodyChars to $BODYCHARS
set output to ""
set delimChar to ASCII character 30
set shown to 0
set foundBox to false

tell application "Mail"
    set acct to account "Exchange"
    repeat with mb in mailboxes of acct
        if (name of mb) is targetName then
            set foundBox to true
            if searchTerm is not "" then
                set matchedMsgs to {}
                try
                    set matchedMsgs to (messages of mb whose subject contains searchTerm or sender contains searchTerm)
                on error
                    set msgCount to count of messages of mb
                    set scanN to 300
                    if msgCount < scanN then set scanN to msgCount
                    repeat with i from 1 to scanN
                        set m to message i of mb
                        try
                            if (subject of m) contains searchTerm or ((sender of m) as string) contains searchTerm then
                                set end of matchedMsgs to m
                            end if
                        end try
                    end repeat
                end try
            else
                set msgCount to count of messages of mb
                set takeN to maxCount - shown
                if msgCount < takeN then set takeN to msgCount
                set matchedMsgs to {}
                repeat with i from 1 to takeN
                    set end of matchedMsgs to message i of mb
                end repeat
            end if

            repeat with m in matchedMsgs
                if shown is greater than or equal to maxCount then exit repeat
                try
                    set output to output & "MAILBOX: " & targetName & linefeed
                    set output to output & "FROM: " & (sender of m) & linefeed
                    set output to output & "SUBJECT: " & (subject of m) & linefeed
                    set output to output & "DATE: " & ((date received of m) as string) & linefeed
                    if bodyChars > 0 then
                        set msgContent to content of m
                        if (count of msgContent) > bodyChars then
                            set msgContent to text 1 thru bodyChars of msgContent
                        end if
                        set output to output & "BODY: " & msgContent & linefeed
                    end if
                    set output to output & delimChar & linefeed
                    set shown to shown + 1
                end try
            end repeat
        end if
    end repeat
end tell

if not foundBox then return "No Exchange mailbox named: " & targetName
if output is "" then return "No matching messages in mailbox: " & targetName
return output
APPLESCRIPT

else
    echo "Usage: mailboxes.sh --list [--filter term] | --mailbox \"Name\" [--search term] [--max N] [--preview|--full]" >&2
    exit 1
fi

osascript /tmp/email-mailboxes.applescript
