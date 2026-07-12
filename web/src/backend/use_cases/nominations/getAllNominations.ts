import dbConnect from 'backend/mongo';
import Nomination, { INomination } from 'backend/models/nomination';

// Returns every nomination, newest first. Used by the admin dashboard.
export async function getAllNominations(): Promise<INomination[]> {
    await dbConnect();
    const nominations = await Nomination
        .find({})
        .sort({ createdAt: -1 })
        .lean();
    return nominations as unknown as INomination[];
}
