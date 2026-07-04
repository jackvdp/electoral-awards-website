---
name: web-page-to-pdf
description: Convert a web page or HTML document to a clean, professional PDF using headless Chrome — with no browser headers, footers, dates or URLs printed into the margins. Use when the user wants to export a page, plan, report, dashboard, or any HTML to a shareable PDF that looks like a designed document rather than a printout.
argument-hint: [HTML file path, a URL, or a description of the page/plan to render]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Web Page to PDF

Turn HTML into a clean PDF with **headless Google Chrome**. The output looks like a designed document — no date, page title, URL or page numbers stamped into the margins — because of one flag (`--no-pdf-header-footer`) plus sensible print CSS in the HTML.

## When to use

- "Give me the X plan as a PDF", "export this page to PDF", "make a PDF of this report/dashboard".
- Anything where the source is (or can be expressed as) HTML and the user wants a polished PDF to share.

## The core command

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="OUTPUT.pdf" "file:///ABSOLUTE/PATH/TO/INPUT.html"
```

Or use the bundled helper, which finds Chrome, resolves the absolute path, and suppresses noise:

```bash
.claude/skills/web-page-to-pdf/html-to-pdf.sh INPUT.html [OUTPUT.pdf]
```

**Why it looks clean — two things, both required:**
1. `--no-pdf-header-footer` removes Chrome's automatic header/footer (the date, page title, file URL and page numbers that otherwise scream "printed web page").
2. The **HTML's own print CSS** sets the page size and margins, so the content is laid out as a document. Without this Chrome falls back to default Letter margins and the framing looks off.

## Two situations

**A. The page is a public, static URL.** Point Chrome straight at it:
```bash
.claude/skills/web-page-to-pdf/html-to-pdf.sh # (edit the command to use the URL in place of file://)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="out.pdf" "https://example.com/page"
```

**B. The page is behind auth, or is a React/Next.js app that won't render without a logged-in session** (e.g. an `/admin/*` page on this site). Headless Chrome is NOT logged in, so don't point it at the live URL. Instead **build a self-contained HTML file that mirrors the page's content and styling**, then convert that. This is what was done for the NOMOS plan below.

## Print CSS that produces a clean document

Put this in the HTML's `<style>`. Keep everything self-contained (inline `<style>`, no external fonts/CSS that won't load from `file://`).

```css
@page { size: A4; margin: 14mm 12mm; }          /* page size + margins live here, not in Chrome */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12.5px; color: #222; }

/* Stop tables, cards and section headings from splitting across pages */
h2, table, .gantt-wrap, .milestones, .stats { page-break-inside: avoid; }
```

Tips:
- Use web-safe fonts (Segoe UI / Arial / Helvetica) or embed a font — `file://` can't reach a CDN.
- Prefer `<table>`/CSS-grid layouts and explicit colours; they render identically headless.
- Add `page-break-inside: avoid` to anything that must not be cut in half.
- Verify by reading the PDF back (the Read tool renders PDF pages as images) before handing it over.

## Worked example — exactly what was done for the NOMOS plan

The request was "provide me the NOMOS plan as a PDF". The plan lives as a live admin page at `/admin/nomos-plan` ([web/pages/admin/nomos-plan.tsx](../../../web/pages/admin/nomos-plan.tsx)) — a Next.js React page behind Supabase admin auth (Situation B). Steps taken:

1. **Confirmed Chrome was available:**
   ```bash
   ls "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
   ```

2. **Built a self-contained HTML mirroring the page** — same content (header, stats, milestones, two Gantt tables, campaign-details table, deliverables table) and the same blue/orange ICPS styling, with the print CSS above. Saved as a NEW file so the existing draft was left untouched:
   `projects/nomos/partnership-plan/NOMOS-ICPS-Partnership-Plan-2026-updated.html`

   The Gantt "bars" are just coloured `<span>`s (no images needed):
   ```css
   .bar { display:inline-block; width:90%; height:14px; border-radius:3px; background:#005f9e; }
   .bar.light  { background:#7ab8d9; }   /* ongoing / background */
   .bar.accent { background:#e8781a; }   /* campaigns / emails  */
   .star { font-size:14px; color:#e8781a; }  /* ★ milestone marker */
   ```

3. **Converted with headless Chrome:**
   ```bash
   cd projects/nomos/partnership-plan
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless --disable-gpu --no-pdf-header-footer \
     --print-to-pdf="NOMOS-ICPS-Partnership-Plan-2026-updated.pdf" \
     "file://$(pwd)/NOMOS-ICPS-Partnership-Plan-2026-updated.html"
   ```
   (Equivalently: `.claude/skills/web-page-to-pdf/html-to-pdf.sh projects/nomos/partnership-plan/NOMOS-ICPS-Partnership-Plan-2026-updated.html`)

4. **Verified** by reading the PDF pages back — three clean A4 pages, no browser header/footer.

Result: `projects/nomos/partnership-plan/NOMOS-ICPS-Partnership-Plan-2026-updated.pdf`. Keep the `.html` source alongside the `.pdf` so it can be regenerated when the content changes.

## Conventions for this repo

- **Don't overwrite** an existing draft/exported file unless asked. Create a new file (e.g. an `-updated` suffix or a dated name) and say so.
- British English; UK dates (19 June 2026).
- Leave the generated files uncommitted unless the user asks to commit them.
- If Chrome prints a `--headless` deprecation note or fails, retry with `--headless=new`.
