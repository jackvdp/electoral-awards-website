# Electoral Stakeholders' Network — Website & Project Context

## Project Overview

This is the website for the **International Electoral Awards & Symposium**, run by the **International Centre for Parliamentary Studies (ICPS)** and the **Electoral Stakeholders' Network**. The site is at **electoralnetwork.org**.

**Jack Vanderpump** (Head of Policy Research, ICPS) manages the Network, the awards programme, the website, and all associated communications. His responsibilities span event logistics, delegate relations, nominations management, judging coordination, content publication, and year-round Network activities.

ICPS is a research institution of the **United Nations Public Administration Network (UNPAN)**, working with partners such as UNDP and ACEEEO. Professional courses are accredited by **The Institute of Leadership and Management (TILM)**.

---

## Tech Stack

- **Framework:** Next.js 15 (Pages Router)
- **Language:** TypeScript / React 18
- **Styling:** Bootstrap 5.2 + SASS (compiled to `public/css`)
- **Database:** MongoDB (via Mongoose) + Supabase (auth/SSR)
- **Storage:** AWS S3 + Vercel Blob
- **Email:** SendGrid + Postmark
- **Image processing:** Sharp
- **Other:** Swiper, GLightbox, Isotope, ScrollCue, react-markdown

## Project Structure

```
pages/
  awards/           — Main awards pages (index, categories, schedule, submit, winners)
  awards/2023/      — 2023 archive
  awards/2024/      — 2024 archive
  admin/dashboard/  — Admin dashboard
  admin/articles/   — Article management
  admin/bookings/   — Booking management
  admin/events/     — Event management
  admin/images/     — Image management
  api/              — API routes (send-email, users, etc.)
  articles/         — Public articles
  events/           — Public events
  gallery.tsx       — Photo gallery
  contact.tsx       — Contact page
  register.tsx      — Registration
  account.tsx       — User account
src/
  data/             — Static data files (award categories, winners, judges, schedules, sponsors)
  components/       — React components
  assets/           — SCSS source files
  auth/             — Authentication helpers
  backend/          — Server-side utilities
  helpers/          — Shared utilities
  hooks/            — React hooks
```

### Key Data Files

| File | Purpose |
|------|---------|
| `src/data/award-categories.ts` | All award category definitions, descriptions, and criteria |
| `src/data/winners25.ts` | 2025 winners |
| `src/data/winners24.ts` | 2024 winners |
| `src/data/winners.ts` | Historical winners (pre-2024) |
| `src/data/judges.ts` | Current judging committee |
| `src/data/schedule.ts` | Current event schedule |
| `src/data/sponsors.ts` | Sponsors |
| `src/data/organisers.ts` | Co-host organisations |
| `src/data/faq.ts` | FAQs |
| `src/data/countries.ts` | Country list (nominations/registration) |

---

## The Awards Programme

### Current Edition: 21st International Electoral Awards (2025)
- **Dates:** 1–4 October 2025
- **Location:** Avani Hotel, Gaborone, Botswana
- **Co-hosts:** ICPS + Independent Electoral Commission (IEC) of Botswana

### Award Categories (11)

1. **International Institutional Engagement** — election assistance/observation by international institutions, NGOs, CSOs
2. **Electoral Conflict Management** — managing pre/post-electoral conflicts
3. **Accessibility for All** — equal access for women, persons with disabilities, minorities
4. **Election Management** — overcoming country-specific challenges for secure, transparent elections
5. **Citizens' Engagement** — maximising citizen participation and trust
6. **First Time Voter** — facilitating optimal first-time voter experience
7. **Electoral Ergonomy** — adapting electoral procedures to voter psychology and characteristics
8. **Lifetime Achievement** — outstanding individual contributions to elections and democracy
9. **Posthumous Meritorious Achievement** — special recognition (posthumous)
10. **Electoral Commissioner of the Year** — non-nomination; selected by Award Committee
11. **Electoral Commission of the Year** — non-nomination; automatic from other category nominees

### Nomination Process
- 5-step online form via Formspree (`/awards/submit`)
- Steps: Nominator info, Nominee info, Category & initiative description, Supporting reference, Additional documents
- File uploads: PDF, DOC, DOCX, JPG, PNG (max 10MB)
- Auto-save drafts to localStorage (24-hour retention)

### Judging Committee (2025)
11 international electoral experts — defined in `src/data/judges.ts`.

---

## Event Structure (4-Day Format)

- **Day 1:** Arrival, registration, welcome reception
- **Day 2:** Symposium (panels, keynotes, fringe events)
- **Day 3:** Symposium continues + Awards Ceremony (evening)
- **Day 4:** Cultural tour (optional) + departures

### 2025 Themes
- Dis/misinformation in elections
- Inclusive participation
- Trust in elections
- Botswana 2024 — practices and challenges

---

## Post-Event Close-Out (Oct 2025 – Feb 2026)

### A. Thank-you & Follow-up
- Speaker emails: thanks, slide-publish consent, certificate, survey
- Winner/nominee emails: congratulations, quote request, listing preferences
- Delegate emails: thanks, survey, photo gallery/resources

### B. Publication & Media
- Winners page (75–120-word citations, photos/logos, rationale)
- Photo gallery with captions/alt text
- Press release with ICPS/IEC quotes; social posts
- Media kit (summary, categories, winners, speakers, contacts)

### C. Certificates & Letters
- Participation and Speaker certificates (mail-merge)
- Letters of appreciation for partners/sponsors
- Awardee badges (PNG/SVG)

### D. Feedback & Reporting
- Post-event surveys (delegates/speakers)
- After-Action Review (4–6 pages)
- Case studies (1,200–1,500 words)
- KPI one-pager (registration, attendance, satisfaction, web, social)

### E. Logistics Wrap-up
- Clean attendee data; confirm transfer logs closed; note finance items

---

## Year-Round Activities (2026)

### 1. Webinars (bi-monthly, 2+ hours)
The Network's primary offering. Deep dives on election integrity, inclusion, conflict management, and trust.

**Format (120–150 mins):**
1. Welcome & housekeeping — 5 mins
2. Speakers — 60–80 mins (3–4 speakers x 20 mins)
3. Follow-up questions — 10 mins
4. Panel discussion — 30 mins
5. Audience Q&A — 10–20 mins
6. Wrap-up & next steps — 5 mins

**Outputs:** Invitation/landing copy, run-sheet, slides deck shell, promo assets, recap post, archive page.

### 2. Regional Roundtables (virtual, quarterly)
Africa, Americas, Asia-Pacific, Europe — surface practices and feed the webinar pipeline.

### 3. Publications & Knowledge
- Practice briefs (2 pages) on tools highlighted in webinars
- Awards watchlist for 2026 nominations
- Maintain winners, gallery, resources, and recordings pages

### 4. Partnerships & Training (ICPS)
- Promote TILM-accredited courses; include UNPAN affiliation
- Custom in-house training worldwide
- Rapid training proposals (2–3 pages) on request

---

## Writing & Style Guide

- **Language:** British English throughout
- **Tone:** Professional, warm, concise
- **Dates:** Day–Month–Year (e.g., 17 September 2025)
- **Numbers:** Words for one–nine, numerals for 10+
- **Accessibility:** Plain language; alt text on images; descriptive links
- **Acronyms:** Define on first use

---

## Local Files (ICPS Folder)

Award operational files are stored at:
`/Users/jackvanderpump/Dropbox/My Mac (Mac-Pro)/Desktop/ICPS/Electoral/`

| Folder | Contents |
|--------|----------|
| `Awards 2025/` | Current year: nominations (CSV + .numbers), judge packs, invitations, email templates, slides, scripts, hotel/venue logistics |
| `Awards 2024/` | Previous year: scripts, slides, nominations, speaker presentations |
| `Awards/` | Historical: judge invitation letters, brochures, past winner records |
| `Awards Industry/` | Electoral industry exhibition concept notes |

### Key Operational Files
- `Awards 2025/Nominations/Awards.csv` — nominations data
- `Awards 2025/Nominations/nominations-formspree.csv` — online form submissions
- `Awards 2025/Awards Pres & Script/Awards Script 2025.pages` — ceremony script
- Various `.emltpl` files — Outlook email templates for invitations

---

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run sass     # Compile SCSS to CSS
```

---

## Templates to Maintain

1. Thank-you emails (Speakers, Delegates, Winners/Nominees)
2. Press release (winners)
3. Certificates (Participation, Speaker)
4. Letters of appreciation
5. Webinar pack: invite, run-sheet, slides shell, recap
6. Training enquiry response + short proposal
7. Case study brief
8. Media quote request
9. Social copy blocks