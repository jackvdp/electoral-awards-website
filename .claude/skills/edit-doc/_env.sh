#!/bin/bash
# Shared helpers for the edit-doc scripts.
#
# Bootstraps a skill-local Python virtualenv on first use. python-docx is the only
# dependency; everything else (Pages conversion, PDF export) is AppleScript.

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="$SKILL_DIR/.venv"
PY="$VENV/bin/python"

ensure_venv() {
    if [[ ! -x "$PY" ]]; then
        echo "Setting up the edit-doc virtualenv (first run only)..." >&2
        python3 -m venv "$VENV" >&2 || { echo "Error: could not create virtualenv" >&2; exit 1; }
        "$VENV/bin/pip" install -q --upgrade pip >&2
        "$VENV/bin/pip" install -q python-docx >&2 || { echo "Error: pip install python-docx failed" >&2; exit 1; }
    fi
}

# Resolve a path to absolute form. AppleScript needs absolute POSIX paths, and the
# file may not exist yet (output paths), so this cannot use realpath alone.
abspath() {
    local p="$1"
    if [[ "$p" = /* ]]; then
        printf '%s' "$p"
    else
        printf '%s/%s' "$(pwd)" "$p"
    fi
}

# Escape a string for embedding in an AppleScript double-quoted literal.
as_escape() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}
