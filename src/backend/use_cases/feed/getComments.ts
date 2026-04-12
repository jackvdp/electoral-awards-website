import { NextApiRequest, NextApiResponse } from 'next';
import Comment from 'backend/models/comment';

async function getComments(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id: postId } = req.query;
        const { before, limit: limitParam } = req.query;
        const limit = Math.min(parseInt(limitParam as string) || 20, 50);

        const query: Record<string, any> = { postId, status: 'active' };

        if (before) {
            query.createdAt = { $lt: new Date(before as string) };
        }

        const comments = await Comment.find(query)
            .sort({ createdAt: 1 })
            .limit(limit)
            .lean();

        const hasMore = comments.length === limit;

        res.status(200).json({ comments, hasMore });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getComments;
