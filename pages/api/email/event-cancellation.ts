import { NextApiRequest, NextApiResponse } from 'next';
import { ServerClient } from "postmark";

interface CancellationEmailData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
}

const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            name,
            email,
            event_name,
            event_date,
        } = req.body as CancellationEmailData;

        // Validate required fields
        if (!name || !event_name || !event_date || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const response = await postmarkClient.sendEmailWithTemplate({
            From: 'info@electoralnetwork.org',
            To: email,
            TemplateAlias: "event-cancellation",
            TemplateModel: {
                name,
                event_name,
                event_date
            },
        });

        const error = response.ErrorCode ? response.Message : null;

        if (error) {
            return res.status(500).json({ error });
        }

        return res.status(200).json({ message: 'Event cancellation email sent successfully' });
    } catch (error) {
        console.error('Error sending event cancellation email:', error);
        return res.status(500).json({ error: error });
    }
}