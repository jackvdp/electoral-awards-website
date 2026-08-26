import { sendMail } from "backend/services/email/mailer";
import { renderBookingInvitation } from "backend/services/email/templates/bookingEmails";
import { BookingConfirmationData } from "./confirmationData";

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
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const eventPageUrl = `${baseUrl}/events/${eventId}`;
        const accept_url = `${baseUrl}/api/bookings/respond?bookingId=${bookingId}&response=accepted&redirectUrl=${encodeURIComponent(eventPageUrl)}`;
        const decline_url = `${baseUrl}/api/bookings/respond?bookingId=${bookingId}&response=rejected&redirectUrl=${encodeURIComponent(eventPageUrl)}`;

        const { subject, html, text } = renderBookingInvitation({
            name,
            event_name,
            event_date,
            event_location,
            agenda_url,
            accept_url,
            decline_url,
        }, isWebinar);

        await sendMail({ to: email, subject, html, text });

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
