import Booking, {IBooking} from "backend/models/booking";

export async function createInvitation({userId, eventId}: {userId: string, eventId: string}): Promise<IBooking> {
    try {
        const existingBooking = await Booking.findOne({ userId, eventId });

        if (existingBooking) {
            throw new Error('User already has a booking or invitation for this event');
        }

        const booking = new Booking({
            userId,
            eventId,
            status: 'invited',
        });

        await booking.save();

        return booking;
    } catch (error) {
        console.error('Error creating invitation:', error);
        throw new Error('Failed to create invitation');
    }
}