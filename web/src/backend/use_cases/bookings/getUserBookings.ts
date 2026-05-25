import Booking, {IBooking} from "backend/models/booking";
import dbConnect from "backend/mongo";

export async function getUserBookings({ userId, status }: {
    userId: string,
    status?: string,
}): Promise<{ bookings: IBooking[], total: number }> {
    await dbConnect()

    try {
        const query: any = {userId}

        // Add status filter if provided
        if (status) {
            query.status = status;
        } else {
            query.status = 'accepted';
        }

        // Get total count for pagination
        const total = await Booking.countDocuments(query);

        const bookings = await Booking
            .find(query)
            .sort({createdAt: -1}) // Sort by most recent first

        return {bookings, total};
    } catch (error) {
        console.error('Error getting user bookings:', error);
        throw new Error('Failed to get user bookings');
    }
}