---
name: linkedin-post
description: Draft and publish a LinkedIn post to the Electoral Members' Network organisation page. Provide a topic, brief, URL to promote, or event to announce.
argument-hint: [topic, brief, or URL to promote — e.g. "Manila 2026 announcement" or "promote latest article"]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# LinkedIn Post — Electoral Members' Network

Draft and publish LinkedIn posts to the ICPS / Electoral Members' Network **organisation page**.

## Workflow

### 1. Understand the brief

Identify what the user wants to post about:
- An event or webinar announcement
- An article or publication to promote
- Awards news (nominations open, winners, judges)
- A general Network update
- A link to share with commentary

### 2. Gather source material

Read relevant files to inform the post:

| Topic | Source files |
|-------|-------------|
| Events / Awards | `src/data/schedule.ts`, `src/data/award-categories.ts`, CLAUDE.md |
| Articles | `src/data/` article files, or the article page itself |
| Winners | `src/data/winners25.ts`, `src/data/winners24.ts` |
| Webinars | Event data in MongoDB (use `edit-event` skill's list mode) |
| Comms plan | `src/data/comms-plan-2026.ts` |

### 3. Draft the post

Write the post following the **Content Guidelines** below. Present the full draft to the user.

### 4. Review

Ask the user: "Here's the draft. Shall I publish it, or would you like changes?"

- If the user requests edits, revise and re-present.
- **Do not publish without explicit approval.**

### 5. Publish

Once approved, run the publish script:

```bash
POST_TEXT='The post text here' node .claude/skills/linkedin-post/publish.mjs
```

To include an article link attachment:

```bash
POST_TEXT='The post text here' POST_URL='https://electoralnetwork.org/articles/...' POST_TITLE='Article Title' node .claude/skills/linkedin-post/publish.mjs
```

Report the result to the user (success with post URN, or error details).

---

## Content Guidelines

### Structure

1. **Hook** (1–2 lines) — grab attention, lead with the news or insight
2. **Body** (3–6 lines) — context, details, what makes this noteworthy
3. **Call to action** — what should the reader do? (register, nominate, read, comment)
4. **Hashtags** (3–5) — always include core tags, plus topic-specific ones

### Tone & Style

- **Professional, warm, and concise** — matching ICPS brand voice
- **British English** throughout
- **Active voice** preferred
- **150–300 words** — the LinkedIn engagement sweet spot
- **Line breaks** between sections for readability (LinkedIn collapses long paragraphs)
- Avoid corporate jargon; prefer plain, direct language
- Use emojis sparingly (1–2 max per post, only if natural)

### Standard Hashtags

Always include 2–3 of these core tags:
- `#Elections` `#Democracy` `#ElectoralIntegrity`
- `#ICPS` `#ElectoralNetwork`

Plus 1–2 topic-specific tags, e.g.:
- `#Manila2026` `#InternationalElectoralAwards`
- `#ElectionManagement` `#VoterEngagement` `#Accessibility`
- `#Webinar` `#ElectoralReform`

### Post Types

**Event announcement:**
- Lead with date, location, co-host
- Mention key highlights (symposium, awards ceremony, cultural programme)
- CTA: register or save the date
- Link to event page

**Article promotion:**
- Lead with the insight or finding, not "we published an article"
- 1–2 key takeaways from the article
- CTA: read the full article
- Link to article

**Awards news:**
- Nominations open: emphasise categories, deadline, who can nominate
- Winners: congratulate, highlight the initiative, tag the org if possible
- CTA: nominate / read about the winners

**Webinar promotion:**
- Lead with the topic/question, not "join our webinar"
- Name 1–2 speakers with credentials
- Date, time, duration
- CTA: register
- Link to event page

---

## Setup

Before first use, LinkedIn API credentials must be configured. If `.env.local` does not contain `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_ORG_ID`, instruct the user to run:

```bash
node .claude/skills/linkedin-post/oauth-setup.mjs
```

This will walk them through the OAuth flow and save the credentials.

### Required `.env.local` variables

```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_ORG_ID=your_org_id
```
