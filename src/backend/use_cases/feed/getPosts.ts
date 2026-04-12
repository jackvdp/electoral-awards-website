import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';

async function getPosts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { before, limit: limitParam } = req.query;
        const limit = Math.min(parseInt(limitParam as string) || 20, 50);

        const query: Record<string, any> = { status: 'active' };

        // Cursor-based pagination
        if (before) {
            query.createdAt = { $lt: new Date(before as string) };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const hasMore = posts.length === limit;

        res.status(200).json({ posts, hasMore });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getPosts;
