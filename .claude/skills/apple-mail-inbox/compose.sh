#!/bin/bash
# Compose a new email in Microsoft Outlook (opens draft, never sends)
# Usage: ./compose.sh --to "email@example.com" --subject "Subject" --body "Body" [--cc "cc@example.com"] [--html]
#
# Arguments:
#   --to       Recipient email address (required, repeatable)
#   --subject  Email subject line (required)
#   --body     The email body text (required)
#   --cc       CC recipient email address (optional, repeatable)
#   --html     Treat --body as HTML content (wraps in full HTML document with styling)

TO_ADDRESSES=()
CC_ADDRESSES=()
SUBJECT=""
BODY=""
HTML_MODE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --to)
            TO_ADDRESSES+=("$2")
            shift 2
            ;;
        --subject)
            SUBJECT="$2"
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
        --html)
            HTML_MODE=true
            shift
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [[ ${#TO_ADDRESSES[@]} -eq 0 || -z "$SUBJECT" || -z "$BODY" ]]; then
    echo "Error: --to, --subject, and --body are required" >&2
    exit 1
fi

# Build To recipient list for AppleScript
TO_LIST=""
for addr in "${TO_ADDRESSES[@]}"; do
    if [[ -n "$TO_LIST" ]]; then
        TO_LIST+=", "
    fi
    TO_LIST+="\"$addr\""
done

# Build To recipient AppleScript lines
TO_SCRIPT=""
for addr in "${TO_ADDRESSES[@]}"; do
    TO_SCRIPT+="  make new recipient at newMessage with properties {email address:{address:\"$addr\"}}"$'\n'
done

# Build CC recipient AppleScript lines
CC_SCRIPT=""
for addr in "${CC_ADDRESSES[@]}"; do
    CC_SCRIPT+="  make new cc recipient at newMessage with properties {email address:{address:\"$addr\"}}"$'\n'
done

# Escape for AppleScript string embedding
ESCAPED_SUBJECT=$(echo "$SUBJECT" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")

if [[ "$HTML_MODE" == true ]]; then
    # Wrap body in full HTML document with styling
    # Use single quotes inside HTML attributes to avoid AppleScript escaping issues
    FULL_HTML="<!DOCTYPE html><html><head><meta charset='UTF-8'><style>p { margin: 0; }</style></head><body style='font-family: Calibri, Arial, sans-serif; font-size: 15px;'>${BODY}</body></html>"
    ESCAPED_BODY=$(echo "$FULL_HTML" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")
else
    ESCAPED_BODY=$(echo "$BODY" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")
fi

cat > /tmp/outlook-compose.applescript << APPLESCRIPT
set emailSubject to "$ESCAPED_SUBJECT"
set emailBody to "$ESCAPED_BODY"

tell application "Microsoft Outlook"
  set newMessage to make new outgoing message with properties {subject:emailSubject, content:emailBody}

$TO_SCRIPT
$CC_SCRIPT

  open newMessage
  activate
end tell
APPLESCRIPT

osascript /tmp/outlook-compose.applescript
