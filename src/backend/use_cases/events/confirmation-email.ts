import axios from 'axios';
import {CustomUserData, MutableUserData} from "../../models/user";
import {IEvent} from "../../models/event";

export interface EventRegistrationData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
    event_location: string;
    agenda_link: string;
}

export function createEventRegistrationData(user: CustomUserData, event: IEvent): EventRegistrationData {
    const eventDate = new Date(event.startDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        event_name: event.title,
        event_date: eventDate,
        event_location: event.location,
        agenda_link: `https://www.electoralnetwork.org/events/${event._id}`
    };
}

/**
 * Sends an event confirmation email to a user who signed up for an event
 * @param data data required for email template
 * @returns Promise with the result of the API call
 */
export async function sendEventConfirmationEmail(data: EventRegistrationData): Promise<{ success: boolean; message: string }> {
    try {

        // Call the API endpoint
        const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/api/email/event-confirmation', data);

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