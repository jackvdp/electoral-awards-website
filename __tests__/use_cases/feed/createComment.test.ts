import createComment from 'backend/use_cases/feed/createComment';
import Comment from 'backend/models/comment';
import Post from 'backend/models/post';

jest.mock('backend/models/comment');
jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: any = {}, body: any = {}): any => ({ query, body });

describe('createComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if content is empty', async () => {
        const req = mockReq({ id: 'post-1' }, { content: '' });
        const res = mockRes();

        await createComment(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Comment content is required' });
    });

    it('should return 400 if content exceeds 500 characters', async () => {
        const req = mockReq({ id: 'post-1' }, { content: 'a'.repeat(501) });
        const res = mockRes();

        await createComment(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Comment must be 500 characters or fewer' });
    });

    it('should return 404 if post does not exist', async () => {
        (Post.findById as jest.Mock).mockResolvedValue(null);

        const req = mockReq({ id: 'nonexistent' }, { content: 'Nice post!' });
        const res = mockRes();

        await createComment(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('should return 429 if user has posted 30 comments in the last hour', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ _id: 'post-1' });
        (Comment.countDocuments as jest.Mock).mockResolvedValue(30);

        const req = mockReq({ id: 'post-1' }, { content: 'Nice post!' });
        const res = mockRes();

        await createComment(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ message: 'You can only post 30 comments per hour' });
    });

    it('should create a comment and increment post commentCount', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ _id: 'post-1' });
        (Comment.countDocuments as jest.Mock).mockResolvedValue(0);
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const savedComment = {
            _id: 'comment-1',
            postId: 'post-1',
            authorId: 'user-1',
            content: 'Nice post!',
        };

        (Comment as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(savedComment),
            ...savedComment,
        }));

        const req = mockReq({ id: 'post-1' }, { content: 'Nice post!' });
        const res = mockRes();

        await createComment(req, res, 'user-1');

        expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('post-1', { $inc: { commentCount: 1 } });
        expect(res.status).toHaveBeenCalledWith(201);
    });
});
