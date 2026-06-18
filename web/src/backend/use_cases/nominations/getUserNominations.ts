import dbConnect from 'backend/mongo';
import Nomination, { INomination } from 'backend/models/nomination';

interface GetUserNominationsArgs {
    userId: string;
    from: Date;
    to: Date;
}

// Returns the nominations a user submitted within a given period, newest first.
export async function getUserNominations({ userId, from, to }: GetUserNominationsArgs): Promise<INomination[]> {
    await dbConnect();
    const nominations = await Nomination
        .find({ userId, createdAt: { $gte: from, $lte: to } })
        .sort({ createdAt: -1 })
        .lean();
    return nominations as unknown as INomination[];
}
