#!/bin/bash
# Convert an Apple Pages document to .docx so it can be edited programmatically.
#
# Usage: ./pages2docx.sh "input.pages" ["output.docx"]
#
# If no output path is given, the .docx is written alongside the input.
#
# Why this exists: modern .pages files are Snappy-compressed protobuf (Index/Document.iwa)
# and cannot be read or written by any library. Pages itself is the only thing that can
# open them, so conversion has to go through the app.

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_env.sh"

if [[ $# -lt 1 ]]; then
    echo "Usage: $0 \"input.pages\" [\"output.docx\"]" >&2
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
    DEST="${SRC%.pages}.docx"
fi

# Pages refuses to export over an existing file.
rm -f "$DEST"

SRC_ESC="$(as_escape "$SRC")"
DEST_ESC="$(as_escape "$DEST")"

# The `with timeout` wrapper is essential. Converting a long document takes well over the
# default AppleEvent timeout, and without it the call fails with error -1712 having done
# nothing. This is the single most common way to break these scripts.
osascript <<APPLESCRIPT >/dev/null
with timeout of 900 seconds
  tell application "Pages"
    set theDoc to open POSIX file "$SRC_ESC"
    export theDoc to POSIX file "$DEST_ESC" as Microsoft Word
    close theDoc saving no
  end tell
end timeout
APPLESCRIPT

if [[ ! -f "$DEST" ]]; then
    echo "Error: conversion produced no file" >&2
    exit 1
fi

echo "$DEST"
