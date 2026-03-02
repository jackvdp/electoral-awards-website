---
name: add-event
description: Add a new event or webinar to the Electoral Stakeholders' Network website by inserting it into MongoDB. Provide event details (title, date, location, description) and the skill will generate and run the seed script.
argument-hint: [event details or path to a file/project containing event details]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Add Event to Electoral Network Website

You add events and webinars to the Electoral Stakeholders' Network website (electoralnetwork.org) by inserting them into MongoDB.

## How It Works

Events on this site are stored in MongoDB (not static files). To add a new event, you run the generic seed script at `.claude/skills/add-event/seed-event.mjs` with the event data passed as a JSON environment variable.

## Steps

1. **Gather event details** from the user's message or from a file/project they reference. You need at minimum:
   - **Title** (string, required)
   - **Start date and time** (ISO 8601, required — default to 13:00 UTC if only a date is given)
   - **End date and time** (ISO 8601, required — derive from start + duration if not explicit)
   - **Location** (string, required — use "Online (Zoom)" for webinars)
   - **Description** (Markdown string, required)
   - **Speakers** (array of `{ name, description, imageURL? }`, optional — omit if not yet confirmed)

2. **Draft the description** in Markdown. The event detail page renders it via `<ReactMarkdown>`. Use British English, professional tone, and include:
   - An overview paragraph
   - Audience note (if applicable)
   - Programme/schedule table (if applicable)
   - Any relevant notes

3. **Build the JSON payload** and run the seed script:

```bash
EVENT_JSON='{ ... }' node .claude/skills/add-event/seed-event.mjs
```

The `EVENT_JSON` environment variable must be a valid JSON object matching the schema below.

4. **Report back** with the event title, date, MongoDB ID, and the URL path (`/events/<id>`).

## Event Schema

```json
{
  "title": "string (required)",
  "startDate": "ISO 8601 datetime (required)",
  "endDate": "ISO 8601 datetime (required)",
  "location": "string (required)",
  "description": "Markdown string (required)",
  "imageURL": "URL string (optional)",
  "speakers": [
    {
      "name": "string (required)",
      "description": "string — role/bio (required)",
      "imageURL": "URL string (optional)"
    }
  ]
}
```

## Style Notes

- **British English** throughout (organise, programme, centre)
- **Dates in description:** Day–Month–Year (e.g., 3 April 2026)
- **Tone:** Professional, warm, concise
- **Acronyms:** Define on first use
- Use em dashes (—) not hyphens for ranges in prose
- Use en dashes (–) for time ranges in tables

## Examples

### Webinar

```bash
EVENT_JSON='{
  "title": "Trust in Elections: Lessons from 2025",
  "startDate": "2026-06-12T13:00:00Z",
  "endDate": "2026-06-12T15:00:00Z",
  "location": "Online (Zoom)",
  "description": "A two-hour webinar exploring...",
  "speakers": []
}' node .claude/skills/add-event/seed-event.mjs
```

### In-Person Event

```bash
EVENT_JSON='{
  "title": "22nd International Electoral Awards & Symposium",
  "startDate": "2026-11-25T09:00:00+08:00",
  "endDate": "2026-11-28T17:00:00+08:00",
  "location": "Manila, Philippines",
  "description": "The 22nd edition of the International Electoral Awards...",
  "speakers": []
}' node .claude/skills/add-event/seed-event.mjs
```