---
name: edit-doc
description: Read, edit and create formatted documents (Apple Pages, Word) while preserving letterhead and layout. Converts .pages to .docx, edits the .docx precisely, exports to PDF for sending. Use when the user wants to change wording in an existing document, produce a letter from an existing template, or turn a document into a PDF.
---

# Edit Doc

Edits ICPS documents (invitation letters, confirmation letters, proposals) without
destroying their letterhead, fonts or layout.

## The constraint that shapes everything

Almost every ICPS document is **Apple Pages**, and a modern `.pages` file is a zip of
Snappy-compressed protobuf (`Index/Document.iwa`). No library can read or write it. Pages
itself is the only thing that can open one, and its AppleScript dictionary is too thin to
edit with: there is no find/replace command, `rich text` exposes only font, colour and
size, and setting text wholesale destroys the layout.

So the working format is `.docx`, which is XML in a zip and can be edited precisely:

```
.pages ──pages2docx.sh──▶ .docx ──docedit.sh──▶ .docx ──docx2pdf.sh──▶ .pdf
        (once, per template)      (the edits)            (for sending)
```

Round-trip fidelity is good. Logos, headers, justified text, fonts, tables and scanned
signature images all survive.

## Scripts

| Script | Purpose |
|--------|---------|
| `pages2docx.sh "in.pages" ["out.docx"]` | Convert Pages to Word. Prints the output path |
| `docedit.sh <subcommand> file.docx ...` | Read and edit the `.docx` |
| `docx2pdf.sh "in.docx" ["out.pdf"]` | Export to PDF. Also accepts `.pages` |

`docedit.sh` creates its own virtualenv (`.venv/`, gitignored) and installs `python-docx`
on first run. Nothing else to set up.

### docedit subcommands

| Subcommand | What it does |
|---|---|
| `text FILE [--runs] [--all]` | Dump every paragraph with its index. **Always start here** |
| `blocks FILE [--all]` | List body blocks (paragraphs *and* tables) in document order |
| `replace FILE --old X --new Y` | Find and replace across body, tables, headers and footers |
| `replace FILE --edits edits.json` | Apply many replacements at once, from `[{"old":..,"new":..}]` |
| `set FILE --index N --text "..."` | Overwrite one paragraph, keeping its style |
| `delete FILE --start A [--end B]` | Delete a range of paragraphs |
| `insert FILE --after N --text "..."` | Insert paragraphs (repeat `--text`), cloning a style |
| `truncate FILE --after N` | Delete every block after block N, tables included |

All editing subcommands take `--out` to write elsewhere instead of in place.

## Workflow

1. **Convert** the `.pages` original to `.docx`. Keep the original untouched.
2. **Read** it with `docedit.sh text` to get paragraph indices, or `blocks` if the change
   is structural (removing an appendix, keeping a signature table).
3. **Edit**, then re-run `text` to confirm the result.
4. **Export** to PDF and **look at it** before it goes anywhere:
   ```bash
   sips -s format png --resampleWidth 900 out.pdf --out page1.png
   ```
   Then read the PNG. Layout damage is invisible in the text dump.

Note `replace` refuses to save when nothing matched, and prints `MISS` for any edit that
found no match, so a silent no-op cannot pass for success.

## Building a new letter from an existing one

The reliable pattern, used for the Sarah Birch confirmation letter:

1. Copy a letter with the right letterhead, for example
   `projects/awards26/letters/_base-invitation-2026.docx` (co-branded COMELEC and ICPS).
2. `blocks` to find the signature table, then `truncate --after <that block>` to drop
   everything below it, appendix tables included.
3. `delete` the old body paragraphs, but **keep the "Kind regards," paragraph** and the
   blank one before it, so the sign-off still meets the signature block.
4. `set` the date, salutation and first paragraphs.
5. `insert --after N --style-from M` for the rest. Pass `--text ""` between paragraphs:
   these documents use empty paragraphs for spacing, so blanks keep the rhythm right.

## Gotchas, all of them learned the hard way

- **AppleEvent timeouts.** Pages conversion exceeds the default timeout and fails with
  `-1712`, having done nothing. Both conversion scripts wrap the call in
  `with timeout of 900 seconds`. Never write a bare `osascript` conversion without it.
- **Runs split mid-sentence.** Word stores "12th February 2026" as `"12th "` +
  `"February 2026"`. A naive per-run replace misses anything crossing a boundary.
  `docedit.py` handles this; check the run split with `text --runs` when a replace misses.
- **Do not use Word.** Its AppleScript find/replace is richer, but Word hangs on launch
  here and times out. Pages handles both directions.
- **Tables are invisible to `delete`.** `delete` only touches paragraphs. Use `blocks`
  and `truncate` for anything involving tables.
- **`truncate` always keeps `sectPr`**, which carries the page setup and the header
  reference. Removing it would strip the letterhead.
- **Signature images travel.** ICPS letter templates contain Tracy Capaldi-Drewett's
  scanned signature and his name and title. Any letter built from one is signed by him
  unless changed. Flag this to the user, and swap the signatory with `replace` if they
  would rather sign it themselves.

## House facts to get right

- **Dates: the templates have the weekdays wrong.** The 22nd Awards run **Sunday 29
  November to Thursday 3 December 2026**, with the **Awards Ceremony on Wednesday 2
  December**. The `Invitation to Attend` template says Saturday 29th, Monday 1st, Tuesday
  2nd and Wednesday 3rd, all a day out. Verify weekdays with
  `date -j -f %Y-%m-%d 2026-12-02 +%A` rather than trusting a template.
- **Venue is not settled.** COMELEC is securing an alternative venue, so keep new
  documents venue-neutral: "Manila, Philippines", never "the Manila Hotel". Several
  templates still name the hotel.
- British English, and **no em dashes**.

## Where documents live

- Originals: `ICPS/Electoral/` (a symlink into Dropbox), chiefly `Awards 2026/` and
  `Invites PDFs/`
- Generated letters and their base templates: `projects/awards26/letters/`
- Scratch conversions: the session scratchpad, not the repo

Save both the `.docx` and the `.pdf` for anything sent out, so it can be amended later
without rebuilding it.
