import { IEvent } from "backend/models/event";

/**
 * Client-side function to fetch all events
 * @returns A promise that resolves to an array of IEvent objects
 */
export async function getAllEventsAPI(): Promise<IEvent[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch events');
    }

    return await response.json();
}