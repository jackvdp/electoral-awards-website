import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { NextApiRequest, NextApiResponse } from 'next';
import { FAQs } from 'data/faq';
import { categories } from 'data/award-categories';
import { schedule } from 'data/schedule';
import { awards } from 'data/winners25';
import { contactInfo } from 'data/contact';

// --- Rate limiting ---
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
let requestCount = 0;

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter(t => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);

  if (++requestCount % 100 === 0) {
    rateLimitMap.forEach((val, key) => {
      const filtered = val.filter(t => now - t < WINDOW_MS);
      if (filtered.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, filtered);
    });
  }

  return false;
}

// --- Build system prompt ---
function buildSystemPrompt(): string {
  const faqText = FAQs.map(f => `Q: ${f.heading}\nA: ${f.body}`).join('\n\n');

  const categoryText = categories
    .map(c => `- ${c.name}: ${c.description}`)
    .join('\n');

  const scheduleText = schedule
    .map(day => {
      const events = day.events
        .map(e => `  ${e.time} — ${e.description.replace(/<[^>]+>/g, '')}`)
        .join('\n');
      return `${day.title}\n${events}`;
    })
    .join('\n\n');

  const winnersText = awards
    .map(a => {
      let line = `- ${a.awardName}: ${a.winner}`;
      if (a.runnersUp?.length) line += ` (Runners-up: ${a.runnersUp.join(', ')})`;
      return line;
    })
    .join('\n');

  return `You are a helpful assistant for the International Electoral Awards & Symposium website (electoralnetwork.org), organised by the International Centre for Parliamentary Studies (ICPS).

Answer questions about the awards programme, event schedule, award categories, past winners, registration, and contact information based on the context below. Be professional, warm, and concise. Use British English.

IMPORTANT BOUNDARIES:
- Do NOT discuss internal judging decisions, deliberations, or processes
- Do NOT reveal or speculate about individual nomination status
- If asked about these topics, politely explain that this information is confidential
- Direct users to electoral@parlicentre.org for specific nomination enquiries

CURRENT EVENT:
22nd International Electoral Awards & Symposium
Dates: 29 November – 3 December 2026
Location: The Manila Hotel, Manila, Philippines
Co-hosts: ICPS and the Commission on Elections of the Philippines (COMELEC)
Accommodation is provided for all delegates at the venue.

CONTACT:
Email: ${contactInfo.email}
Phone: ${contactInfo.phone}
Address: ${contactInfo.address.replace(/\n/g, ', ')}

FREQUENTLY ASKED QUESTIONS:
${faqText}

AWARD CATEGORIES (11):
${categoryText}

Note: The Electoral Commissioner of the Year and Electoral Commission of the Year are non-nomination categories — winners are selected by the Award Committee.

EVENT SCHEDULE (2026):
${scheduleText}

2025 AWARD WINNERS:
${winnersText}

USEFUL LINKS:
- Award categories: /awards/categories
- Submit a nomination: /awards/submit
- Event schedule: /awards/schedule
- Past winners: /awards/winners
- Contact: /contact
- Register: /register
- Gallery: /gallery

When providing links, use markdown format like [Award Categories](/awards/categories).`;
}

const systemPrompt = buildSystemPrompt();

// --- API handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }

  const { messages } = req.body;

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: systemPrompt,
    messages,
    maxOutputTokens: 500,
  });

  result.pipeUIMessageStreamToResponse(res);
}
