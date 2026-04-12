import { NextApiRequest, NextApiResponse } from 'next';
import Post from 'backend/models/post';

async function getPost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        const post = await Post.findById(id).lean();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Failed to fetch post', error: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}

export default getPost;
