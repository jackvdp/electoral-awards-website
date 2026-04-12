import updatePost from 'backend/use_cases/feed/updatePost';
import Post from 'backend/models/post';

jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: any = {}, body: any = {}): any => ({ query, body });

describe('updatePost', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if post does not exist', async () => {
        (Post.findById as jest.Mock).mockResolvedValue(null);

        const req = mockReq({ id: 'nonexistent' }, { content: 'Updated' });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user is not the author', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({
            authorId: 'user-2',
            createdAt: new Date(),
        });

        const req = mockReq({ id: 'post-1' }, { content: 'Updated' });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'You can only edit your own posts' });
    });

    it('should return 403 if post is older than 15 minutes', async () => {
        const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
        (Post.findById as jest.Mock).mockResolvedValue({
            authorId: 'user-1',
            createdAt: twentyMinutesAgo,
        });

        const req = mockReq({ id: 'post-1' }, { content: 'Updated' });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Posts can only be edited within 15 minutes of creation' });
    });

    it('should return 400 if content is empty', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({
            authorId: 'user-1',
            createdAt: new Date(),
        });

        const req = mockReq({ id: 'post-1' }, { content: '' });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if content exceeds 1000 characters', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({
            authorId: 'user-1',
            createdAt: new Date(),
        });

        const req = mockReq({ id: 'post-1' }, { content: 'a'.repeat(1001) });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should update the post successfully within the edit window', async () => {
        const post = {
            authorId: 'user-1',
            createdAt: new Date(),
            content: 'Old content',
            save: jest.fn().mockResolvedValue(true),
        };
        (Post.findById as jest.Mock).mockResolvedValue(post);

        const req = mockReq({ id: 'post-1' }, { content: 'Updated content' });
        const res = mockRes();

        await updatePost(req, res, 'user-1');

        expect(post.content).toBe('Updated content');
        expect(post.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
