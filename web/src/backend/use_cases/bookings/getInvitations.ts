import Booking, {IBooking} from "backend/models/booking";
import dbConnect from "backend/mongo";

export async function getInvitations({ userId }: {
    userId?: string,
}): Promise<{ bookings: IBooking[], total: number }> {
    await dbConnect();

    try {
        const query: any = { status: { $in: ['invited', 'rejected'] } };

        // Add userId filter if provided
        if (userId) {
            query.userId = userId;
        }

        // Get total count for pagination
        const total = await Booking.countDocuments(query);

        const bookings = await Booking
            .find(query)
            .sort({invitedAt: -1}); // Sort by most recent invitation first

        return {bookings, total};
    } catch (error) {
        console.error('Error getting invitations:', error);
        throw new Error('Failed to get invitations');
    }
}