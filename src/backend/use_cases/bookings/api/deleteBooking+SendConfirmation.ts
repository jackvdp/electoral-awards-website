import { IEvent } from "backend/models/event";
import { MutableUserData } from "backend/models/user";

/**
 * Client-side version of deleteBookingAndSendCancellation with identical signature
 * This function calls the API route but maintains the same interface as the server function
 */
export async function deleteBookingAPI({
                                                           bookingId,
                                                           user,
                                                           event
                                                       }: {
    bookingId: string,
    user?: MutableUserData,
    event?: IEvent
}): Promise<{success: boolean, message: string}> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(baseUrl + `/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user,
            event,
        }),
    });

    return await response.json();
}