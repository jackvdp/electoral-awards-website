---
name: edit-event
description: Edit an existing event or webinar on the Electoral Stakeholders' Network website. Update any combination of fields (title, dates, location, description, image, speakers) in MongoDB.
argument-hint: [what to change, e.g. "change the workforce webinar date to 15 April"]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Edit Event on Electoral Network Website

You edit existing events and webinars on the Electoral Stakeholders' Network website (electoralnetwork.org) by updating them in MongoDB.

## How It Works

Events are stored in MongoDB. To edit one, you first identify the event, then run the update script at `.claude/skills/edit-event/update-event.mjs` with the event ID and the fields to update passed as JSON environment variables.

## Steps

### 1. Identify the event

If the user doesn't provide an event ID, list events to find it:

```bash
node .claude/skills/edit-event/update-event.mjs --list
```

This prints all events with their IDs, titles, and dates. Use the title or date to match the user's request.

### 2. Fetch current state

Before editing, always fetch the current event so you can show the user what will change:

```bash
EVENT_ID='<id>' node .claude/skills/edit-event/update-event.mjs --show
```

### 3. Apply updates

Pass only the fields that need changing:

```bash
EVENT_ID='<id>' UPDATE_JSON='{ "title": "New Title" }' node .claude/skills/edit-event/update-event.mjs
```

The `UPDATE_JSON` environment variable is a JSON object containing only the fields to update. Any field not included is left unchanged.

### 4. Report back

Confirm what was changed, showing before and after values where helpful.

## Updatable Fields

All fields are optional in `UPDATE_JSON` — include only what needs to change:

```json
{
  "title": "string",
  "startDate": "ISO 8601 datetime",
  "endDate": "ISO 8601 datetime",
  "location": "string",
  "description": "Markdown string",
  "imageURL": "URL string",
  "speakers": [
    {
      "name": "string",
      "description": "string — role/bio",
      "imageURL": "URL string (optional)"
    }
  ]
}
```

**Note on speakers:** Providing `speakers` replaces the entire speakers array. To add a speaker, fetch the current list first, append to it, and send the full array.

## Common Operations

### Change date
```bash
EVENT_ID='abc123' UPDATE_JSON='{ "startDate": "2026-05-15T13:00:00Z", "endDate": "2026-05-15T15:00:00Z" }' node .claude/skills/edit-event/update-event.mjs
```

### Update description
For longer descriptions, write the markdown to a temporary file and use it in the JSON, or build the JSON programmatically with an inline Node script.

### Add/update speakers
```bash
EVENT_ID='abc123' UPDATE_JSON='{ "speakers": [{ "name": "Dr Jane Smith", "description": "Director, International IDEA" }] }' node .claude/skills/edit-event/update-event.mjs
```

### Change image
```bash
EVENT_ID='abc123' UPDATE_JSON='{ "imageURL": "https://example.com/image.jpg" }' node .claude/skills/edit-event/update-event.mjs
```

## Style Notes

- **British English** throughout (organise, programme, centre)
- **Dates in description:** Day–Month–Year (e.g., 3 April 2026)
- **Tone:** Professional, warm, concise
- **Acronyms:** Define on first use
- Use em dashes (—) not hyphens for ranges in prose
- Use en dashes (–) for time ranges in tables