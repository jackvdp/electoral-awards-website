import { IEvent } from "backend/models/event";
import { MutableUserData } from "backend/models/user";
import { IBooking } from "backend/models/booking";
import { updateBooking } from "./updateBooking";
import { sendBookingConfirmation } from "./confirmations/sendBookingConfirmation";
import { createBookingConfirmationData } from "./confirmations/confirmationData";
import {sendInvitationConfirmation} from "./confirmations/sendInvitationConfirmation";

export async function updateBookingAndSendConfirmation({
                                                           bookingId,
                                                           status,
                                                           user,
                                                           event
                                                       }: {
    bookingId: string,
    status: "invited" | "accepted" | "rejected",
    user: MutableUserData,
    event: IEvent
}): Promise<{ success: boolean, message: string, booking?: IBooking }> {
    try {
        const result = await updateBooking({
            bookingId,
            status
        });

        if (!result.success) {
            return result;
        }

        if (status === 'accepted') {
            sendConfirmationEmailInBackground(user, event);
        }

        if (status === 'invited') {
            sendInvitationEmailInBackground(user, event, bookingId)
        }

        return result;
    } catch (error) {
        console.error('Error updating booking and sending confirmation:', error);
        return {
            success: false,
            message: 'Failed to update booking and send confirmation'
        };
    }
}

// Helper function to handle email sending in background
function sendConfirmationEmailInBackground(user: MutableUserData, event: IEvent): void {
    Promise.resolve().then(async () => {
        try {
            await sendBookingConfirmation(createBookingConfirmationData(user, event));
        } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError);
        }
    });
}

function sendInvitationEmailInBackground(user: MutableUserData, event: IEvent, bookingId: string): void {
    Promise.resolve().then(async () => {
        try {
            await sendInvitationConfirmation(createBookingConfirmationData(user, event, bookingId));
        } catch (emailError) {
            console.error('Failed to send invitation confirmation email:', emailError);
        }
    });
}