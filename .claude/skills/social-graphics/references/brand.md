# House style for social graphics

Derived from electoralnetwork.org (`web/src/assets/scss`, Sandbox theme). If the site's
styles look like they have changed, re-check `_theme-colors.scss` and `style.scss`
rather than trusting this file.

## Palette

| Token | Hex | Use |
|---|---|---|
| Navy | `#343f52` | Dark slide grounds, headings on white, numbered badges |
| Blue | `#3f78e0` | Section markers (kicker bar + label), icons on white slides |
| Yellow | `#fab758` | ONE thing per deck: the deadline, the date, the key stat. Kicker accents on navy slides |
| Off-white | `#fcfcfd` | Light slide ground |
| Card border | `#e3e7ee` | 1px borders on white cards, footer rules |
| Body text | `#5b6678` | Paragraph copy on white |
| Muted | `#9aa3b2` | Footers, page markers |
| On-navy body | `rgba(255,255,255,0.75)` | Secondary text on navy |

## Type

Manrope (Google Fonts, weights 400/500/700/800), fallback `'Helvetica Neue', Arial,
sans-serif`. Scale that worked at 1080×1350:

- Cover headline: 96–110px / 800 / line-height 1.06 / letter-spacing -2px
- Slide headline: 64–72px / 800 / 1.1
- Kicker: 26px / 700 / letter-spacing 5px / uppercase
- Card / list text: 27–33px / 700
- Body: 30–34px / 500 / 1.45
- Footer: 24px

## Slide anatomy (carousel)

- **Canvas**: 1080×1350 (4:5), padding 88px top/bottom, 96px sides.
- **Bookends**: first and last slides on navy, carrying the ICPS white logo
  (`ICPSLogo Original White.png`, downsampled) and the co-host/partner logo. Middle
  slides on off-white.
- **Kicker**: a 44×4px bar + uppercase letterspaced label (yellow on navy, blue on
  white). Same position every slide — it is the deck's rhythm.
- **Decoration**: two concentric circle outlines (blue and yellow at ~30% alpha)
  bleeding off a corner of the navy slides. Nothing else; no gradients, no photos
  unless a rights-cleared image is supplied.
- **Cards**: white, 1px `#e3e7ee` border, 12px radius, 30–32px padding. Grids use
  `display: grid; repeat(2, minmax(0,1fr)); gap: 24px`.
- **Icons**: inline SVG, stroke-based, 1.8–2px stroke, blue on white / yellow on navy.
  Never emoji.
- **Footer** (middle slides): `electoralnetwork.org` left, page marker right, above a
  1px rule. (Jack removed the "n / 5" page markers on the first deck — ask or leave
  them out.)
- **Cover**: kicker, big headline, location + dates, swipe cue (text + arrow SVG).
- **Closing slide**: the call to action. Key fact in a yellow block (navy text), URL in
  a bordered pill, logos at the bottom.

## Single image

Same anatomy compressed to one 1080×1350 slide: navy ground, kicker, headline, the
yellow key-fact block, URL pill, logos. It must work with no other slides around it.

## Logos

`web/public/img/logos/` — ICPS white (`ICPSLogo Original White.png`, 3034px master),
ICPS colour, COMELEC seal, past co-hosts. Downsample with `sips -Z 600` (white logo) /
`sips -Z 200` (seals) to stay under 70 KB per image.
