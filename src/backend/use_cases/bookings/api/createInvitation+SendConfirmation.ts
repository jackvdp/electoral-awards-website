import { MutableUserData } from 'backend/models/user';
import { IEvent } from 'backend/models/event';
import {IBooking} from "backend/models/booking";

export async function createInvitationAndSendConfirmation({user, event}: { user: MutableUserData, event: IEvent}): Promise<IBooking> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const response = await fetch(baseUrl + '/api/bookings/invitations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, event }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to invite user to event');
        }

        return await response.json();
    } catch (error) {
        console.error('Error inviting user to event:', error);
        throw error;
    }
}