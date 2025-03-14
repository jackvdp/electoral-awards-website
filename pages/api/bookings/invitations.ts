// /api/invitations
import type { NextApiRequest, NextApiResponse } from 'next';
import {createInvitationAndSendConfirmation} from "backend/use_cases/bookings/createInvitation+SendConfirmation";
import dbConnect from "backend/mongo";
import {getInvitations} from "backend/use_cases/bookings/getInvitations";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "GET":
            return GET(req, res);
        case 'POST':
            return POST(req, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    try {
        const invitationData = req.body;

        if (!invitationData || !invitationData.user || !invitationData.event) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const result = await createInvitationAndSendConfirmation(invitationData);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in createInvitation:', error);
        if (error instanceof Error && error.message.includes('already has a booking')) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();
    // Extract userId from query parameters
    const { userId } = req.query;

    try {
        const result = await getInvitations({
            userId: userId as string | undefined
        });

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get pending invitations'
        });
    }
}