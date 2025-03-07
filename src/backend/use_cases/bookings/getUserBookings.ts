'use server';

import Booking, {IBooking} from "backend/models/booking";

export async function getUserBookings({ userId, status }: {
    userId: string,
    status?: string,
}): Promise<{ bookings: IBooking[], total: number }> {
    try {
        const query: any = {userId}

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Get total count for pagination
        const total = await Booking.countDocuments(query);

        const bookings = await Booking
            .find(query)
            .sort({createdAt: -1}) // Sort by most recent first

        return {bookings, total};
    } catch (error) {
        console.error('Error getting event bookings:', error);
        throw new Error('Failed to get event bookings');
    }
}