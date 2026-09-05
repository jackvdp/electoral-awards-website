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
#   --attach   Path to a file to attach (optional, repeatable)

TO_ADDRESSES=()
CC_ADDRESSES=()
ATTACH_PATHS=()
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
        --attach)
            ATTACH_PATHS+=("$2")
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

# Build attachment AppleScript lines (resolve to absolute paths, verify each exists)
ATTACH_SCRIPT=""
for path in "${ATTACH_PATHS[@]}"; do
    abs_path=$(cd "$(dirname "$path")" 2>/dev/null && printf '%s/%s' "$(pwd)" "$(basename "$path")")
    if [[ -z "$abs_path" || ! -f "$abs_path" ]]; then
        echo "Error: attachment not found: $path" >&2
        exit 1
    fi
    ESCAPED_PATH=$(echo "$abs_path" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")
    # `make new attachment at newMessage ...` silently no-ops in Outlook: the call
    # succeeds, osascript exits 0, and the draft opens with nothing attached.
    # Addressing the message directly with `tell` is the form that actually works.
    ATTACH_SCRIPT+="  tell newMessage to make new attachment with properties {file:POSIX file \"$ESCAPED_PATH\"}"$'\n'
done

# Fail loudly if an attachment did not take, rather than opening a draft that
# looks complete but has nothing attached.
ATTACH_VERIFY=""
if [[ ${#ATTACH_PATHS[@]} -gt 0 ]]; then
    ATTACH_VERIFY="  if (count of attachments of newMessage) is not ${#ATTACH_PATHS[@]} then error \"Attachment failed: expected ${#ATTACH_PATHS[@]}\""
fi

# Escape for AppleScript string embedding
ESCAPED_SUBJECT=$(echo "$SUBJECT" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")

if [[ "$HTML_MODE" == true ]]; then
    # Use --body as-is (inner HTML supplied by caller)
    INNER_HTML="$BODY"
else
    # Outlook's `content` property is HTML, so raw newlines collapse into one
    # block. Escape HTML entities and convert newlines to <br> so plain-text
    # bodies keep their line breaks and blank-line spacing.
    INNER_HTML=$(printf '%s' "$BODY" | perl -pe 's/&/&amp;/g; s/</&lt;/g; s/>/&gt;/g' | perl -0pe 's/\n/<br>/g')
fi

# Wrap body in full HTML document with styling
# Use single quotes inside HTML attributes to avoid AppleScript escaping issues
#
# Paragraph spacing: `p { margin: 0 }` used to be set here. It is inert for plain-text
# bodies (those become <br>-separated, with no <p> tags at all) but in --html mode it
# collapsed every paragraph against the next, so drafts arrived as one solid block.
# Give <p> a bottom margin instead, and zero the top margin so the first line still sits
# flush. Callers writing --html do not need inline margins.
FULL_HTML="<!DOCTYPE html><html><head><meta charset='UTF-8'><style>p { margin: 0 0 14px 0; } p:last-child { margin-bottom: 0; } ul, ol { margin: 0 0 14px 0; padding-left: 22px; } li { margin: 0 0 4px 0; }</style></head><body style='font-family: Calibri, Arial, sans-serif; font-size: 15px;'>${INNER_HTML}</body></html>"
ESCAPED_BODY=$(echo "$FULL_HTML" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")

cat > /tmp/outlook-compose.applescript << APPLESCRIPT
set emailSubject to "$ESCAPED_SUBJECT"
set emailBody to "$ESCAPED_BODY"

tell application "Microsoft Outlook"
  set newMessage to make new outgoing message with properties {subject:emailSubject, content:emailBody}

$TO_SCRIPT
$CC_SCRIPT
$ATTACH_SCRIPT
$ATTACH_VERIFY

  open newMessage
  activate
end tell
APPLESCRIPT

osascript /tmp/outlook-compose.applescript
