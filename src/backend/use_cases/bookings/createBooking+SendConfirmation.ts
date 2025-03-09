import {IEvent} from "backend/models/event";
import {MutableUserData} from "backend/models/user";
import {IBooking} from "backend/models/booking";
import {createBooking} from "./createBooking";
import {sendBookingConfirmation} from "./confirmations/sendBookingConfirmation";
import {createBookingConfirmationData} from "./confirmations/confirmationData";

export async function createBookingAndSendConfirmation({user, event}: { user: MutableUserData, event: IEvent}): Promise<IBooking> {
    try {
        const booking = await createBooking({
            userId: user.id,
            eventId: event._id as string,
        })

        sendConfirmationEmailInBackground(user, event);

        return booking;
    } catch (error) {
        console.error('Error creating booking and sending confirmation:', error);
        throw new Error('Failed to create booking and send confirmation');
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