import Booking, {IBooking} from "backend/models/booking";
import {updateBooking} from "./updateBooking";

export async function createBooking({userId, eventId}: {userId: string, eventId: string}): Promise<IBooking> {
    try {
        const existingBooking = await Booking.findOne({ userId, eventId });

        if (existingBooking) {

            if (existingBooking.status === 'accepted') {
                throw new Error('User already has a booking for this event');
            }

            const result = await updateBooking({
                bookingId: existingBooking._id.toString(),
                status: 'accepted'
            });

            if (result.success && result.booking) {
                return result.booking;
            } else {
                throw new Error('Failed to update existing booking');
            }
        } else {
            const booking = new Booking ({
                userId,
                eventId,
                status: 'accepted',
            });

            await booking.save();

            return booking;
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
}