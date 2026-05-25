import { IBooking } from 'backend/models/booking';

export async function getInvitations(userId: string): Promise<{ bookings: IBooking[], total: number }> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
        const url = `${baseUrl}/api/bookings/invitations?userId=${userId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch pending invitations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pending invitations:', error);
        throw error;
    }
}