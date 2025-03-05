import axios from 'axios';
import { CustomUserData } from "backend/models/user";
import { IEvent } from "backend/models/event";
import formatEventDates from "helpers/formatEventDates";

export interface CancellationResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface CancellationEmailData {
    name: string;
    email: string;
    event_name: string;
    event_date: string;
}

/**
 * Creates the event cancellation data object from user and event data
 */
export function createCancellationEmailData(user: CustomUserData, event: IEvent): CancellationEmailData {
    return {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        event_name: event.title,
        event_date: formatEventDates(event.startDate, event.endDate),
    };
}

/**
 * Sends an event cancellation confirmation email
 * This function is called separately and doesn't block the main cancellation flow
 */
export async function sendCancellationConfirmationEmail(data: CancellationEmailData): Promise<{ success: boolean; message: string }> {
    try {
        // Call the API endpoint
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const response = await axios.post(`${baseUrl}/api/email/event-cancellation`, data);

        return {
            success: true,
            message: 'Cancellation confirmation email sent successfully'
        };
    } catch (error) {
        console.error('Failed to send cancellation confirmation email:', error);

        let errorMessage = 'Failed to send cancellation confirmation email';
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

/**
 * Cancels a user's signup for an event by making an API call to /api/events/signup
 */
export async function cancelEventSignup(userId: string, eventId: string): Promise<CancellationResponse> {
    try {
        const response = await fetch('/api/events/signup', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                eventId,
                userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: data.message || 'Successfully cancelled event registration'
            };
        } else {
            return {
                success: false,
                message: 'Failed to cancel event registration',
                error: data.error || 'Unknown error occurred'
            };
        }
    } catch (error) {
        console.error('Error cancelling event registration:', error);
        return {
            success: false,
            message: 'Failed to cancel event registration',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Unified use case that handles both cancelling an event registration and sending a confirmation email
 * The email sending happens asynchronously and doesn't block the main flow
 */
export async function cancelEventAndSendConfirmation(
    userId: string,
    eventId: string,
    user: CustomUserData,
    event: IEvent
): Promise<CancellationResponse> {
    try {
        // First, cancel the user's event registration
        const cancellationResult = await cancelEventSignup(userId, eventId);

        if (cancellationResult.success) {
            // If cancellation was successful, send the confirmation email in the background
            // We don't await this call so it doesn't block the main flow
            const cancellationEmailData = createCancellationEmailData(user, event);

            // Fire and forget - we don't wait for this to complete
            sendCancellationConfirmationEmail(cancellationEmailData)
                .then(emailResult => {
                    if (!emailResult.success) {
                        console.warn('Cancellation confirmation email failed to send, but registration was cancelled successfully');
                    }
                })
                .catch(error => {
                    console.error('Error sending cancellation confirmation email:', error);
                });

            return cancellationResult;
        } else {
            return cancellationResult;
        }
    } catch (error) {
        console.error('Error in cancelEventAndSendConfirmation:', error);
        return {
            success: false,
            message: 'Failed to complete cancellation process',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}