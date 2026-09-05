---
name: add-article
description: Write and publish an article to the Electoral Members' Network website. Provide a topic, source material, or brief and the skill will draft, review, and insert the article into MongoDB.
argument-hint: [topic, source material, or brief — e.g. "digital voting in Denmark" or a pasted article]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Add Article to Electoral Network Website

Write and publish articles to the Electoral Members' Network website (electoralnetwork.org). Articles are stored in MongoDB and rendered with ReactMarkdown.

## House Style and Tone

Articles on the Electoral Members' Network are **analytical, not promotional**. The tone should read like a piece in *The Economist* — authoritative, concise, and insight-driven.

### Voice

- **Analytical, not descriptive.** Don't just report what happened — explain why it matters, what it reveals, and what the electoral community can learn from it.
- **Authoritative but accessible.** Write for senior electoral professionals who are time-poor. Lead with the insight, not the background.
- **Concise.** Prefer short sentences and short paragraphs. Every paragraph should earn its place. If a sentence doesn't add insight, cut it.
- **Wry where appropriate.** A dry observation or a well-placed contrast can do more than a paragraph of exposition. Don't force it, but don't be afraid of it either.

### Structure

- **Open with context and a hook.** Set the scene in 2–3 sentences, then pivot to why this matters. The reader should know within the first paragraph why they should keep reading.
- **Use subheadings** (`###` in Markdown) to break the piece into logical sections. Subheadings should be informative, not generic — *"A patchwork of approaches"* rather than *"Background"*.
- **Close with takeaways.** End with clear, actionable insights for the electoral community. Use bold lead-ins for each takeaway where appropriate.
- **Target length:** 800–1,500 words. Long enough to be substantive, short enough to be read in one sitting.

### Referring to organisations and practitioners

- **Name practitioners factually on first mention** — e.g. *"delivered through a platform provided by Lumi Global, an election technology firm"*. After that, use short references: *"the provider"*, *"the firm"*, *"Lumi's specialists"*.
- **Do not promote.** No calls to action, no links to company websites, no language that reads like marketing copy. If an organisation did the work, say so — but frame it as a fact within the narrative, not an endorsement.
- **Attribute where the narrative requires it.** If a company or institution was central to the story, name them. If they were incidental, a generic reference (*"the technology partner"*) is fine.

### Language

- **British English** throughout (organise, programme, centre, recognised, digitalised)
- **Dates:** Day–Month–Year (e.g. 18 November 2025)
- **Numbers:** Words for one–nine, numerals for 10+
- **Acronyms:** Define on first use — e.g. *Election Management Bodies (EMBs)*
- **Em dashes** (—) for parenthetical asides, not hyphens
- **En dashes** (–) for ranges (20–25%)
- Use *italics* for foreign terms on first use

### What to avoid

- Promotional language, superlatives, or marketing copy
- "We are pleased to...", "We are delighted to..." — this is journalism, not correspondence
- Generic openings ("In today's world...", "Elections are the cornerstone of democracy...")
- Bullet-point lists in the body (use prose; bullet points are for takeaways only)
- Passive voice where active is clearer
- Jargon without explanation

## Article Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | String | Yes | Clear, specific headline — not clickbait |
| `link` | String | Yes | URL slug (kebab-case, e.g. `digital-voting-elder-councils-denmark`) |
| `image` | String | Yes | Image URL — use Unsplash (`https://images.unsplash.com/...?w=960&h=600&fit=crop`) for stock images |
| `category` | String | Yes | e.g. Electoral Innovation, Election Management, Accessibility, Civic Engagement |
| `description` | String | Yes | 1–2 sentence summary for the article listing page |
| `date` | String | Auto | ISO 8601 timestamp — defaults to now if omitted |
| `content` | String | Yes | **Markdown** (rendered with ReactMarkdown) — NOT HTML |

## Steps

### 1. Understand the brief

The user will provide one of:
- A **topic or brief** ("write something about digital voting in Denmark")
- **Source material** (a pasted article, report, or notes to rewrite)
- A **file or URL** to read and adapt

If source material is provided, the task is to **rewrite it in house style** — not to copy-paste. Extract the facts and insights, then write an original piece.

### 2. Draft the article

Write the article content in Markdown following the house style above. Show the user the draft for review before publishing.

Include:
- A compelling title
- A 1–2 sentence description for the listing page
- An appropriate category
- A suggested slug

### 3. Get user approval

Present the draft and ask for feedback. Iterate until the user is happy.

### 4. Choose an image

If the user hasn't provided one, suggest a relevant Unsplash stock image URL. Use the format:
```
https://images.unsplash.com/photo-XXXX?w=960&h=600&fit=crop
```

### 5. Publish

Run the seed script to insert into MongoDB:

```bash
ARTICLE_JSON='{ "title": "...", "link": "...", "image": "...", "category": "...", "description": "...", "content": "..." }' node .claude/skills/add-article/seed-article.mjs
```

**Important:** The `content` field must be Markdown, not HTML. The site renders it with `<ReactMarkdown>`.

For long content, write the JSON to a temp file and use:

```bash
ARTICLE_JSON="$(cat /tmp/article.json)" node .claude/skills/add-article/seed-article.mjs
```

### 6. Report back

Tell the user:
- The article title
- The URL path (`/articles/<id>`)
- That it's live on the site

## Example

User: "Can you write up this report on voter turnout in Pacific Island nations"

1. Read the source material
2. Draft an analytical piece in house style (~1,000 words)
3. Show the user for review — iterate on feedback
4. Suggest an Unsplash image
5. Run the seed script
6. Report: "Article published — 'Voter Turnout in the Pacific: Small Islands, Big Lessons' is live at /articles/abc123"
