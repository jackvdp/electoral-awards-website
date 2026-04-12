import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';

async function updatePost(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const { id } = req.query;
        const { content } = req.body;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'You can only edit your own posts' });
        }

        // 15-minute edit window
        const fifteenMinutes = 15 * 60 * 1000;
        if (Date.now() - post.createdAt.getTime() > fifteenMinutes) {
            return res.status(403).json({ message: 'Posts can only be edited within 15 minutes of creation' });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Post content is required' });
        }

        if (content.length > 1000) {
            return res.status(400).json({ message: 'Post content must be 1000 characters or fewer' });
        }

        post.content = content.trim();
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to update post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default updatePost;
