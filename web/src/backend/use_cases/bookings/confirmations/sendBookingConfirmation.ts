import { sendMail } from "backend/services/email/mailer";
import { renderBookingConfirmation } from "backend/services/email/templates/bookingEmails";
import { BookingConfirmationData } from "./confirmationData";

export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<{ success: boolean; message: string }> {
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
        const { subject, html, text } = renderBookingConfirmation({
            name,
            event_name,
            event_date,
            event_location,
            agenda_url,
        }, isWebinar);

        await sendMail({ to: email, subject, html, text });

        return {
            success: true,
            message: 'Event registration email sent successfully'
        };
    } catch (error) {
        console.error('Error sending event registration email:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to send event registration email'
        };
    }
}
