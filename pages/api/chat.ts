import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';
import { systemPrompt } from 'data/chatbot-prompt';
import { checkEmailExists } from 'backend/use_cases/auth/checkEmailExists';
import { sendPasswordReset } from 'backend/use_cases/auth/sendPasswordReset';
import { sendMagicLink } from 'backend/use_cases/auth/sendMagicLink';

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

// --- API handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIP(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }

  const { messages, isLoggedIn, userName } = req.body;

  let userContext = '\n\nUSER STATUS: The user is not signed in.';
  if (isLoggedIn && userName) {
    userContext = `\n\nUSER STATUS: The user is signed in as ${userName}. They can register for events directly.`;
  } else if (isLoggedIn) {
    userContext = '\n\nUSER STATUS: The user is signed in. They can register for events directly.';
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: systemPrompt() + userContext,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
    tools: {
      getEvents: tool({
        description: 'Fetch all upcoming and past events and webinars from the database. Use this when the user asks about events, webinars, or what is coming up.',
        inputSchema: z.object({}),
        execute: async () => {
          const res = await fetch(`${baseUrl}/api/events`);
          if (!res.ok) return [];
          const events = await res.json();
          return events.map((e: any) => ({
            title: e.title,
            startDate: e.startDate,
            endDate: e.endDate,
            location: e.location,
            description: e.description,
            speakers: e.speakers?.map((s: any) => s.name) || [],
          }));
        },
      }),
      checkEmailExists: tool({
        description: 'Check if a user account exists for a given email address. Use when the user wants to know if they have an account.',
        inputSchema: z.object({ email: z.string() }),
        execute: async ({ email }) => {
          const exists = await checkEmailExists(email);
          return { exists };
        },
      }),
      sendPasswordReset: tool({
        description: 'Send a password reset email to the user. Use when the user has forgotten their password and wants to reset it.',
        inputSchema: z.object({ email: z.string() }),
        execute: async ({ email }) => {
          const exists = await checkEmailExists(email);
          if (!exists) return { sent: false, error: 'No account found with that email address.' };
          await sendPasswordReset(email);
          return { sent: true };
        },
      }),
      sendMagicLink: tool({
        description: "Send a magic sign-in link to the user's email so they can log in without a password. Use when the user wants to sign in via email link.",
        inputSchema: z.object({ email: z.string() }),
        execute: async ({ email }) => {
          const exists = await checkEmailExists(email);
          if (!exists) return { sent: false, error: 'No account found with that email address.' };
          await sendMagicLink(email);
          return { sent: true };
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  result.pipeUIMessageStreamToResponse(res);
}
