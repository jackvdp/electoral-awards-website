import { IBooking } from "backend/models/booking";

/**
 * Client-side version of getEventBookings with identical signature
 * This function calls the API route but maintains the same interface as the server function
 */
export async function getEventBookingsAPI({ eventId, status }: {
    eventId: string,
    status?: string,
}): Promise<{ bookings: IBooking[], total: number }> {
    // Build the URL with optional status parameter
    let url = `/api/bookings/events/${eventId}`;
    if (status) {
        url += `?status=${encodeURIComponent(status)}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get event bookings');
    }

    return await response.json();
}