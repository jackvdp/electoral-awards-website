import { NextApiRequest, NextApiResponse } from 'next';
import { ServerClient } from "postmark";
import { EventRegistrationData } from 'backend/use_cases/events/confirmation-email';

const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            name,
            event_name,
            event_date,
            event_location,
            agenda_link,
            email,
        } = req.body as EventRegistrationData;

        // Validate required fields
        if (!name || !event_name || !event_date || !event_location || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const response = await postmarkClient.sendEmailWithTemplate({
            From: 'it@parlicentre.org',
            To: email,
            TemplateAlias: "user-invitation",
            TemplateModel: {
                name,
                event_name,
                event_date,
                event_location,
                agenda_link
            },
        });

        const error = response.ErrorCode ? response.Message : null;

        if (error) {
            return res.status(500).json({ error });
        }

        return res.status(200).json({ message: 'Event registration email sent successfully' });
    } catch (error) {
        console.error('Error sending event registration email:', error);
        return res.status(500).json({ error: error });
    }
}