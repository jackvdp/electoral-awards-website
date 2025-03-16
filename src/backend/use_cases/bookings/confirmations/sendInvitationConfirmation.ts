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
            eventId,
            bookingId
        } = data;

        // Validate required fields
        if (!name || !event_name || !event_date || !event_location || !email || !eventId || !bookingId) {
            throw new Error('Missing required fields');
        }

        const isWebinar = event_location.toLowerCase().includes('webinar') || event_name.toLowerCase().includes('webinar');
        const templateAlias = isWebinar ? "webinar-invitation" : "event-invitation";
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const eventPageUrl = `${baseUrl}/events/${eventId}`;
        const accept_url = `${baseUrl}/api/bookings/respond?bookingId=${bookingId}&response=accepted&redirectUrl=${encodeURIComponent(eventPageUrl)}`;
        const decline_url = `${baseUrl}/api/bookings/respond?bookingId=${bookingId}&response=rejected&redirectUrl=${encodeURIComponent(eventPageUrl)}`;

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
                accept_url,
                decline_url,
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