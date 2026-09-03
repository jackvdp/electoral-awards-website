#!/bin/bash
# Wrapper around docedit.py that uses the skill-local virtualenv.
# Creates the venv and installs python-docx on first run.
#
# Usage: ./docedit.sh <subcommand> [args...]   (see docedit.py --help)

set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_env.sh"
ensure_venv
exec "$PY" "$SKILL_DIR/docedit.py" "$@"
