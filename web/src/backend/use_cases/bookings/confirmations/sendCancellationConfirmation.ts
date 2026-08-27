import { sendMail } from "backend/services/email/mailer";
import { renderBookingCancellation } from "backend/services/email/templates/bookingEmails";
import { BookingConfirmationData } from "./confirmationData";

export async function sendBookingCancellation(data: BookingConfirmationData): Promise<{ success: boolean; message: string }> {
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

        const { subject, html, text } = renderBookingCancellation({
            name,
            event_name,
            event_date,
            event_location,
            agenda_url,
        });

        await sendMail({ to: email, subject, html, text });

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
