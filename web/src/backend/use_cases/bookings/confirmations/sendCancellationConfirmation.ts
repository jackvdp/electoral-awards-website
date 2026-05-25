import { ServerClient } from "postmark";
import {BookingConfirmationData} from "./confirmationData";

export async function sendBookingCancellation(data: BookingConfirmationData): Promise<{ success: boolean; message: string }> {
    const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN!);

    try {
        const {
            name,
            event_name,
            event_date,
            event_location,
            agenda_url,
            email,
        } = data;

        // Validate required fields
        if (!name || !event_name || !event_date || !event_location || !email) {
            throw new Error('Missing required fields');
        }

        const response = await postmarkClient.sendEmailWithTemplate({
            From: 'info@electoralnetwork.org',
            To: email,
            TemplateAlias: "event-cancellation",
            TemplateModel: {
                name,
                event_name,
                event_date,
                event_location,
                agenda_url
            },
        });

        if (response.ErrorCode) {
            throw new Error(response.Message);
        }

        return {
            success: true,
            message: 'Event cancellation email sent successfully'
        };
    } catch (error) {
        console.error('Error sending event cancellation email:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send event cancellation email'
        };
    }
}