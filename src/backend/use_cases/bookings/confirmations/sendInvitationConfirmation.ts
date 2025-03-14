import { ServerClient } from "postmark";
import { BookingConfirmationData } from "./confirmationData";

const postmarkClient = new ServerClient(process.env.POSTMARK_API_TOKEN!);

export async function sendInvitationConfirmation(data: BookingConfirmationData): Promise<{ success: boolean; message: string }> {
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

        const isWebinar = event_location.toLowerCase().includes('webinar') || event_name.toLowerCase().includes('webinar');
        const templateAlias = isWebinar ? "webinar-invitation" : "event-invitation";

        const response = await postmarkClient.sendEmailWithTemplate({
            From: 'info@electoralnetwork.org',
            To: email,
            TemplateAlias: templateAlias,
            TemplateModel: {
                name,
                event_name,
                event_date,
                event_location,
                agenda_url,
                response_url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/respond?eventId=${data.eventId}&userId=${data.userId}`
            },
        });

        if (response.ErrorCode) {
            throw new Error(response.Message);
        }

        return {
            success: true,
            message: 'Event invitation email sent successfully'
        };
    } catch (error) {
        console.error('Error sending event invitation email:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send event invitation email'
        };
    }
}