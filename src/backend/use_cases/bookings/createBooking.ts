import Booking, {IBooking} from "backend/models/booking";

export async function createBooking({userId, eventId}: {userId: string, eventId: string}): Promise<IBooking> {
    try {
        const existingBooking = await Booking.findOne({ userId, eventId });

        if (existingBooking) {
            throw new Error('User already has a booking for this event');
        }

        const booking = new Booking ({
            userId,
            eventId,
            status: 'accepted',
        });

        await booking.save();

        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
}