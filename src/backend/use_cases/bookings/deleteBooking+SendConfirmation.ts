"use server"

import {IEvent} from "backend/models/event";
import {MutableUserData} from "backend/models/user";
import {deleteBooking} from "./deleteBooking";
import {createBookingConfirmationData} from "./confirmations/confirmationData";
import {sendBookingCancellation} from "./confirmations/sendCancellationConfirmation";

export async function deleteBookingAndSendCancellation({
                                                           bookingId,
                                                           user,
                                                           event
                                                       }: {
    bookingId: string,
    user: MutableUserData,
    event: IEvent
}): Promise<{success: boolean, message: string}> {
    try {
        // Delete the booking
        const result = await deleteBooking({ bookingId });

        if (!result.success) {
            return result;
        }

        // Send cancellation email in the background
        sendCancellationEmailInBackground(user, event);

        return result;
    } catch (error) {
        console.error('Error deleting booking:', error);
        return {
            success: false,
            message: 'Failed to delete booking and send cancellation'
        };
    }
}

// Helper function to handle email sending in background
function sendCancellationEmailInBackground(user: MutableUserData, event: IEvent): void {
    Promise.resolve().then(async () => {
        try {
            await sendBookingCancellation(createBookingConfirmationData(user, event));
        } catch (emailError) {
            console.error('Failed to send booking cancellation email:', emailError);
        }
    });
}