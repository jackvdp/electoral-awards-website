# Network & ICPS - General Context

For the awards programme (categories, editions, winners, ceremony, post-event close-out), see `/awards-admin`. This file covers the year-round and ICPS-wide context only.

## ICPS

The **International Centre for Parliamentary Studies (ICPS)** builds public-sector capability through training, conferences, and policy dialogue. A research institution of the **United Nations Public Administration Network (UNPAN)**, ICPS works with partners such as **UNDP** and **ACEEEO**. All professional courses are accredited by **The Institute of Leadership and Management (TILM)**. ICPS delivers open programmes in London and custom in-house training worldwide.

**Address:** Millbank Tower, London, SW1P 4QP
**Contact:** electoral@parlicentre.org
**Website:** electoralnetwork.org

## Electoral Members' Network

The Network connects electoral management bodies, civil society organisations, academics, observers, and practitioners worldwide. Year-round activities:

- **Bi-monthly webinars** (2+ hours) - deep dives on electoral topics (see format below)
- **Quarterly regional roundtables** - Africa, Americas, Asia-Pacific, Europe; surface practices and feed the webinar pipeline
- **Practice briefs and publications** - 2-page summaries on tools highlighted in webinars; awards watchlist; case studies
- **Training programmes** - TILM-accredited courses (open in London, in-house worldwide)
- **Maintained resources** - winners archive, gallery, recordings, articles

The Network's flagship event is the **annual International Electoral Awards & Symposium** - covered in `/awards-admin`.

## Key people

### ICPS
- **Jack Vanderpump** - Head of Policy Research, ICPS (manages the Network)
- **Matt Gokhool** - CEO, ICPS

## Webinar programme (2026)

### Format (120-150 minutes)
1. **Welcome & housekeeping** - 5 mins (host + moderator)
2. **Speakers** - 60-80 mins (3-4 speakers x 20 mins each)
3. **Follow-up questions** - 10 mins (short clarifiers from moderator)
4. **Panel discussion** - 30 mins (all speakers + moderator)
5. **Audience Q&A** - 10-20 mins (chat + hands)
6. **Wrap-up & next steps** - 5 mins (resources, survey, upcoming dates)

### Operational notes
- Collect 100-word bios and headshots from speakers
- Confirm slide-sharing consent
- Provide captions where possible
- Share reading pack in advance
- Record session; publish edited recording, slides, and key takeaways
- Post-webinar survey
- Bi-monthly cadence

### Outputs per webinar
Invitation, landing-page copy, run-sheet, slides deck shell, promo assets, recap post, archive page.

## Regional roundtables

Virtual, quarterly. Four regions: Africa, Americas, Asia-Pacific, Europe. Purpose:
- Surface electoral practices from each region
- Identify topics, speakers, and case studies for the webinar pipeline
- Build regional sub-communities within the Network

## Training (ICPS)

- **Open programmes** in London, scheduled through the year
- **Custom in-house training** delivered at client locations worldwide
- All courses **TILM-accredited**; ICPS is a UNPAN research institution
- **Rapid training proposals** (2-3 pages) on request - turn around in days

## File locations

### ICPS Dropbox
`/Users/jackvanderpump/Dropbox/My Mac (Mac-Pro)/Desktop/ICPS/Electoral/`

Awards materials (Awards 2026/, Awards 2025/, etc.) are referenced from `/awards-admin`.

### Website data files (`web/src/data/`)
- `comms-plan-2026.ts` - 2026 delegate-acquisition comms plan
- `faq.ts` - FAQs
- (Awards-specific files like `winners*.ts`, `judges.ts`, `schedule.ts` are documented in `/awards-admin`.)

### Events (MongoDB)
Webinars and roundtables, when shown on the public site, are stored in MongoDB. Use `/add-event` or `/edit-event` to manage them.

### Drafted emails
`emails/` directory in the repo, as `.txt` files named `YYYY-MM-<topic>.txt`.
