import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';

async function deletePost(req: NextApiRequest, res: NextApiResponse, userId: string, isAdmin: boolean) {
    try {
        const { id } = req.query;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Only the author or an admin can delete
        if (post.authorId !== userId && !isAdmin) {
            return res.status(403).json({ message: 'You do not have permission to delete this post' });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to delete post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default deletePost;
