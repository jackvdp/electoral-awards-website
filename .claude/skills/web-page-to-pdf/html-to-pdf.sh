#!/usr/bin/env bash
# Convert a self-contained HTML file to a clean PDF using headless Chrome.
#
# Why headless Chrome: with --no-pdf-header-footer it produces a PDF with NO
# browser chrome — no date, page title, URL or page numbers printed into the
# margins. The result looks like a designed document, not a printout of a web page.
#
# Usage: html-to-pdf.sh <input.html> [output.pdf]
#   output.pdf defaults to the input path with a .pdf extension.
set -euo pipefail

IN="${1:?Usage: html-to-pdf.sh <input.html> [output.pdf]}"
OUT="${2:-${IN%.*}.pdf}"

# Resolve an absolute path so file:// works regardless of cwd.
case "$IN" in
  /*) ABS_IN="$IN" ;;
  *)  ABS_IN="$(pwd)/$IN" ;;
esac

if [ ! -f "$ABS_IN" ]; then
  echo "Input not found: $ABS_IN" >&2
  exit 1
fi

# Find a Chromium-family browser (macOS app bundles first, then PATH).
CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "$(command -v google-chrome 2>/dev/null || true)" \
  "$(command -v chromium 2>/dev/null || true)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done

if [ -z "$CHROME" ]; then
  echo "No Chrome/Chromium browser found. Install Google Chrome." >&2
  exit 1
fi

# --no-pdf-header-footer is the flag that removes the date/URL/title margins.
# Page size and margins come from the @page CSS rule in the HTML itself.
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "file://$ABS_IN" 2>/dev/null || true

if [ -f "$OUT" ]; then
  echo "Wrote $OUT"
else
  echo "PDF was not created. Try --headless=new instead of --headless." >&2
  exit 1
fi
