#!/bin/bash
# Reply to an email in Apple Mail (Exchange inbox)
# Usage: ./reply.sh --sender "email@example.com" --body "Dear X, ..." [--cc "cc@example.com"]
#
# Arguments:
#   --sender  Email address or name to match the message to reply to (required)
#   --body    The reply text to paste into the message (required)
#   --cc      CC recipient email address (optional, repeatable)

SENDER=""
BODY=""
CC_ADDRESSES=()

while [[ $# -gt 0 ]]; do
    case "$1" in
        --sender)
            SENDER="$2"
            shift 2
            ;;
        --body)
            BODY="$2"
            shift 2
            ;;
        --cc)
            CC_ADDRESSES+=("$2")
            shift 2
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [[ -z "$SENDER" || -z "$BODY" ]]; then
    echo "Error: --sender and --body are required" >&2
    exit 1
fi

# Build CC AppleScript lines
CC_SCRIPT=""
for addr in "${CC_ADDRESSES[@]}"; do
    CC_SCRIPT+="            make new cc recipient at end of cc recipients of replyMsg with properties {address:\"$addr\"}"$'\n'
done

# Write the AppleScript to a temp file
cat > /tmp/mail-reply.applescript << APPLESCRIPT
set replyBody to "$(echo "$BODY" | sed 's/\\/\\\\/g; s/"/\\"/g')

"

tell application "Mail"
    set exchangeAccount to account "Exchange"
    set inboxMailbox to mailbox "Inbox" of exchangeAccount
    set inboxMessages to messages of inboxMailbox

    repeat with msg in inboxMessages
        if sender of msg contains "$SENDER" then
            set replyMsg to reply msg opening window yes
            delay 2

$CC_SCRIPT
            activate
            exit repeat
        end if
    end repeat
end tell

set the clipboard to replyBody

tell application "System Events"
    tell process "Mail"
        key code 126 using {command down}
        keystroke "v" using {command down}
    end tell
end tell
APPLESCRIPT

osascript /tmp/mail-reply.applescript
