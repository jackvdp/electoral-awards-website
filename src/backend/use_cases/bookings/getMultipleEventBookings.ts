import Booking, { IBooking } from "backend/models/booking";
import dbConnect from "backend/mongo";

/**
 * Retrieves bookings for multiple events in a single query
 *
 * @param eventIds - Array of event IDs to fetch bookings for
 * @param status - Optional status filter
 * @returns Object containing bookings grouped by eventId and total count
 */
export async function getMultipleEventBookings({
                                                   eventIds,
                                                   status
                                               }: {
    eventIds: string[],
    status?: string,
}): Promise<{
    bookingsByEvent: Record<string, IBooking[]>
}> {
    await dbConnect();

    try {
        // Create the query object
        const query: any = {
            eventId: { $in: eventIds }
        };

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Get all bookings for the specified events
        const bookings = await Booking
            .find(query)
            .sort({createdAt: -1}); // Sort by most recent first

        // Group bookings by event ID
        const bookingsByEvent: Record<string, IBooking[]> = {};

        // Initialize empty arrays for all provided event IDs
        eventIds.forEach(eventId => {
            bookingsByEvent[eventId] = [];
        });

        // Group bookings by their event ID
        bookings.forEach(booking => {
            const eventId = booking.eventId.toString();
            if (!bookingsByEvent[eventId]) {
                bookingsByEvent[eventId] = [];
            }
            bookingsByEvent[eventId].push(booking);
        });

        return { bookingsByEvent };
    } catch (error) {
        console.error('Error getting multiple event bookings:', error);
        throw new Error('Failed to get multiple event bookings');
    }
}