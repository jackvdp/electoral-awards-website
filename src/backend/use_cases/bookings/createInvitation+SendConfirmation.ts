import {IEvent} from "backend/models/event";
import {MutableUserData} from "backend/models/user";
import {IBooking} from "backend/models/booking";
import {createInvitation} from "./createInvitation";
import {sendInvitationConfirmation} from "./confirmations/sendInvitationConfirmation";
import {createBookingConfirmationData} from "./confirmations/confirmationData";

export async function createInvitationAndSendConfirmation({user, event}: { user: MutableUserData, event: IEvent}): Promise<IBooking> {
    try {
        const booking = await createInvitation({
            userId: user.id,
            eventId: event._id as string,
        });

        sendInvitationEmailInBackground(user, event);

        return booking;
    } catch (error) {
        console.error('Error creating invitation and sending confirmation:', error);
        throw new Error('Failed to create invitation and send confirmation');
    }
}

// Helper function to handle email sending in background
function sendInvitationEmailInBackground(user: MutableUserData, event: IEvent): void {
    Promise.resolve().then(async () => {
        try {
            await sendInvitationConfirmation(createBookingConfirmationData(user, event));
        } catch (emailError) {
            console.error('Failed to send invitation confirmation email:', emailError);
        }
    });
}