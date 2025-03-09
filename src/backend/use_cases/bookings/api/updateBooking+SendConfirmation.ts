// client/bookings.ts
import { IBooking } from "backend/models/booking";
import { IEvent } from "backend/models/event";
import { MutableUserData } from "backend/models/user";

/**
 * Client-side version of updateBookingAndSendConfirmation with identical signature
 * This function calls the API route but maintains the same interface as the server function
 */
export async function updateBookingAPI({
                                                           bookingId,
                                                           status,
                                                           user,
                                                           event
                                                       }: {
    bookingId: string,
    status: "invited" | "accepted" | "rejected",
    user: MutableUserData,
    event: IEvent
}): Promise<{ success: boolean, message: string, booking?: IBooking }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(baseUrl + `/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status,
            user,
            event
        }),
    });

    return await response.json();
}