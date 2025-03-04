import axios from 'axios';
import {MutableUserData} from "../../models/user";
import {IEvent} from "../../models/event";

export interface EventRegistrationData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
    event_location: string;
    agenda_link: string;
}

/**
 * Sends an event confirmation email to a user who signed up for an event
 * @param user User data of the participant
 * @param event Event data the user signed up for
 * @returns Promise with the result of the API call
 */
export async function sendEventConfirmationEmail(user: MutableUserData, event: IEvent): Promise<{ success: boolean; message: string }> {
    try {
        // Validate required user fields
        if (!user.email || !user.firstname || !user.lastname) {
            throw new Error('Missing required user data for event confirmation email');
        }

        // Validate required event fields
        if (!event.title || !event.startDate || !event.location) {
            throw new Error('Missing required event data for confirmation email');
        }

        // Format date for email template
        const eventDate = new Date(event.startDate).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Prepare data for email template
        const emailData = {
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            event_name: event.title,
            event_date: eventDate,
            event_location: event.location,
            agenda_link: `https://www.electoralnetwork.org/events/${event._id}`
        };

        // Call the API endpoint
        const response = await axios.post('/api/email/event-confirmation', emailData);

        return {
            success: true,
            message: 'Event confirmation email sent successfully'
        };

    } catch (error) {
        console.error('Failed to send event confirmation email:', error);

        let errorMessage = 'Failed to send confirmation email';
        if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error || errorMessage;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            success: false,
            message: errorMessage
        };
    }
}