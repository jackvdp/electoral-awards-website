import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'backend/supabase/server-props';
import { systemPrompt } from 'data/chatbot-prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth check
  const supabase = createClient({ req, res } as any);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.user_metadata.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email content is required' });
  }

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: `You are an email reply assistant for the International Electoral Awards & Symposium team. Staff will paste in emails they have received from delegates or potential delegates. Draft a professional, warm reply using British English.

Use the following context to inform your replies:

${systemPrompt()}

INSTRUCTIONS:
- Draft a reply that directly addresses the sender's questions or requests
- Be helpful, professional, and concise
- Use the context above to provide accurate information about the awards, events, registration, etc.
- Do not include a subject line — just the body of the reply
- Start with an appropriate greeting (e.g. "Dear [Name],") using the sender's name from their email
- End with "Kind regards," followed by a blank line (the staff member will add their own signature)
- If the email contains questions you cannot answer from the context provided, acknowledge them and suggest the sender contacts electoral@parlicentre.org for further assistance
- Do not fabricate information — only use what is provided in the context above`,
    messages: [
      {
        role: 'user',
        content: `Please draft a reply to the following email:\n\n${email}`,
      },
    ],
    maxOutputTokens: 1000,
  });

  result.pipeTextStreamToResponse(res);
}
