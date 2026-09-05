---
name: social-graphics
description: >
  Design social and promotional graphics for the Electoral Members' Network / ICPS as an
  editable design canvas, then render the final PDF/PNGs locally. Use for LinkedIn
  carousels, single post images, event announcement graphics, campaign visuals, or any
  time Jack wants "the visuals" / "the images" / "a carousel" / "slides" to accompany a
  post or campaign. Also use when Jack asks to export or re-render an existing graphics
  canvas to PDF/PNG. For the text of a LinkedIn post itself, use /linkedin-post (the two
  pair: it writes the copy, this skill makes the visuals).
---

# Social graphics — design canvas + local render

Make branded graphics Jack can tweak visually before they go out. The flow: verify the
facts, draft the slides in the house style, publish them as a design canvas artifact for
Jack to edit, then pull his saved version and render print-ready files locally.

## Workflow

### 1. Understand the brief

- What is it promoting, and on which channel?
- Which project does it belong to? Read that project's `CLAUDE.md` under `projects/`
  first — it is the source of truth for dates, names, and any confidentiality rules
  (e.g. awards26 requires venue-neutral wording: "Manila, Philippines", never a hotel).
- **Every fact that appears on a slide must be verified** against project docs or
  `web/src/data/` (deadlines are in `web/src/data/awards-config.ts`, categories in
  `award-categories.ts`). A wrong date on a graphic is worse than in a post — it cannot
  be edited after people screenshot it.
- If the accompanying post copy does not exist yet, offer to draft it with
  `/linkedin-post` — on-image copy and post copy should agree.

### 2. Choose the format

| Situation | Format |
|---|---|
| First mention of a topic, multi-point story, campaign launch | Carousel (4–6 slides, 1080×1350) |
| Reminder, single announcement, deadline push | Single image (1080×1350) |
| Link-share header image | 1200×627 landscape |

LinkedIn accepts a multi-page PDF directly as a carousel (document post). Portrait 4:5
takes the most feed space.

### 3. Design in the house style

Read [references/brand.md](references/brand.md) for the palette, type, slide anatomy and
layout patterns. Defaults in brief: Manrope, navy `#343f52` bookend slides, white middle
slides, blue `#3f78e0` section markers, yellow `#fab758` reserved for the single most
important fact. Logos live in `web/public/img/logos/` (downsample to under 70 KB with
`sips -Z`). Overrides (a sponsor's colours, a co-host's branding) are fine when the brief
calls for them — keep Manrope and the layout system so the page still reads as ours.

Writing rules apply on slides too: British English, dates as "29 November 2026", no em
dashes, minimal on-image copy (a slide is read in about three seconds).

### 4. Build the canvas

Invoke the `design` skill and author one `.dc.html` artboard per slide plus a
`canvas.json`, then seed and publish as an artifact. Conventions that have worked:

- Name artboards by role (`Main.dc.html` for the cover, then `TheEvent`, `Categories`,
  `Nominate`...), titled "1 · Cover", "2 · ..." in `canvas.json`.
- Keep slides static (no `data-props` script) — Jack edits text and styles directly on
  the canvas.
- Add a sticky-note annotation telling Jack how to export, in case he wants to do it
  himself from the toolbar.
- Keep the working files; hand over the artifact link with a one-line description.

### 5. Jack edits, then render locally

The artifact is the editing surface; the deliverable files are rendered here, because
the artifact's own PDF export cannot embed Google Fonts (falls back to Helvetica) and
cannot be triggered without Jack clicking it.

When Jack is happy (or has saved edits — a republish notification will arrive):

1. Re-read the artifact (`Artifact` tool, `action: "read"`) and extract the saved
   version with the design skill's `seed-canvas.mjs --extract` into a fresh directory.
   Skip this if the canvas was never edited — use the working files directly.
2. Run the bundled renderer (needs Chrome; the script finds it):

   ```bash
   node .claude/skills/social-graphics/scripts/render-slides.mjs \
     --dir <extracted-or-working-dir> \
     --pdf <output.pdf> \
     --png-dir <optional dir for per-slide PNGs>
   ```

   It reads `canvas.json` for slide order and size, inlines the images, waits for
   Manrope to load, and produces one multi-page PDF plus optional PNGs.
3. Save deliverables to the relevant `projects/<project>/` folder, named like
   `2026-09-linkedin-nominations-carousel.pdf`. Tell Jack the paths and that the PDF
   uploads to LinkedIn as-is for a carousel post.

### Re-rendering later

If Jack edits the canvas again after delivery, repeat step 5 from the fresh artifact —
never re-render from stale working files over his saved edits.

## Gotchas

- The design-canvas `.dc.html` format and the seed/extract helper belong to the
  `design` skill — invoke it rather than working from memory.
- Downsample any raster image below ~70 KB before seeding; oversized entries are
  silently dropped.
- The renderer needs network access for Google Fonts; if Chrome renders the fallback
  font, re-run — the script's virtual-time budget usually covers it.
- Do not store finished graphics in the repo root or `web/`; they are project
  deliverables (`projects/<project>/`), and `projects/` is gitignored by design.
