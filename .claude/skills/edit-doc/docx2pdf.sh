#!/bin/bash
# Export a .docx (or .pages) to PDF, for sending.
#
# Usage: ./docx2pdf.sh "input.docx" ["output.pdf"]
#
# Uses Pages rather than Word. Word's AppleScript find/replace is richer, but Word hangs
# on launch in this environment and times out; Pages handles both directions reliably.

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_env.sh"

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 \"input.docx\" [\"output.pdf\"]" >&2
    exit 1
fi

SRC="$(abspath "$1")"
if [[ ! -e "$SRC" ]]; then
    echo "Error: not found: $SRC" >&2
    exit 1
fi

if [[ $# -ge 2 ]]; then
    DEST="$(abspath "$2")"
else
    DEST="${SRC%.*}.pdf"
fi

rm -f "$DEST"

SRC_ESC="$(as_escape "$SRC")"
DEST_ESC="$(as_escape "$DEST")"

# See the note in pages2docx.sh: the timeout wrapper is not optional.
osascript <<APPLESCRIPT >/dev/null
with timeout of 900 seconds
  tell application "Pages"
    set theDoc to open POSIX file "$SRC_ESC"
    export theDoc to POSIX file "$DEST_ESC" as PDF
    close theDoc saving no
  end tell
end timeout
APPLESCRIPT

if [[ ! -f "$DEST" ]]; then
    echo "Error: export produced no file" >&2
    exit 1
fi

echo "$DEST"
