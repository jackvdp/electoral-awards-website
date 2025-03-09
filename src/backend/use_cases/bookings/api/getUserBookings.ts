// client/bookings.ts
import { IBooking } from "backend/models/booking";

/**
 * Client-side version of getUserBookings with identical signature
 * This function calls the API route but maintains the same interface as the server function
 */
export async function getUserBookingsAPI({ userId, status }: {
    userId: string,
    status?: "invited" | "accepted" | "rejected",
}): Promise<{ bookings: IBooking[], total: number }> {
    // Build the URL with optional status parameter
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    let url = baseUrl + `/api/bookings/users/${userId}`;
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
        throw new Error(errorData.message || 'Failed to get user bookings');
    }

    return await response.json();
}