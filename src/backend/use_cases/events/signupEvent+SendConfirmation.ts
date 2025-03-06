import axios from 'axios';
import { CustomUserData } from "backend/models/user";
import { IEvent } from "backend/models/event";
import {createEventRegistrationData, sendEventConfirmationEmail} from "./sendEventConfirmationEmail";

export interface SignupResponse {
    success: boolean;
    message: string;
    error?: string;
}

/**
 * Signs up a user for an event by making an API call to /api/events/signup
 */
export async function signupForEvent(userId: string, eventId: string): Promise<SignupResponse> {
    try {
        const response = await fetch('/api/events/signup', {
            method: 'POST',
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
                message: data.message || 'Successfully signed up for the event'
            };
        } else {
            return {
                success: false,
                message: 'Failed to sign up for event',
                error: data.error || 'Unknown error occurred'
            };
        }
    } catch (error) {
        console.error('Error signing up for event:', error);
        return {
            success: false,
            message: 'Failed to sign up for event',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Unified use case that handles both signing up for an event and sending a confirmation email
 * The email sending happens asynchronously and doesn't block the main flow
 */
export async function signupEventAndSendConfirmation(
    userId: string,
    eventId: string,
    user: CustomUserData,
    event: IEvent
): Promise<SignupResponse> {
    try {
        // First, sign up the user for the event
        const signupResult = await signupForEvent(userId, eventId);

        if (signupResult.success) {
            // If signup was successful, send the confirmation email in the background
            // We don't await this call so it doesn't block the main flow
            const eventRegistrationData = createEventRegistrationData(user, event);

            // Fire and forget - we don't wait for this to complete
            sendEventConfirmationEmail(eventRegistrationData)
                .then(emailResult => {
                    if (!emailResult.success) {
                        console.warn('Confirmation email failed to send, but user was signed up successfully');
                    }
                })
                .catch(error => {
                    console.error('Error sending confirmation email:', error);
                });

            return signupResult;
        } else {
            return signupResult;
        }
    } catch (error) {
        console.error('Error in signupEventAndSendConfirmation:', error);
        return {
            success: false,
            message: 'Failed to complete signup process',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}