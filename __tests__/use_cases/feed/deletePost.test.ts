import deletePost from 'backend/use_cases/feed/deletePost';
import Post from 'backend/models/post';

jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: any = {}): any => ({ query });

describe('deletePost', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if post does not exist', async () => {
        (Post.findById as jest.Mock).mockResolvedValue(null);

        const req = mockReq({ id: 'nonexistent' });
        const res = mockRes();

        await deletePost(req, res, 'user-1', false);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('should return 403 if user is not the author and not admin', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ authorId: 'user-2' });

        const req = mockReq({ id: 'post-1' });
        const res = mockRes();

        await deletePost(req, res, 'user-1', false);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow the author to delete their post', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ authorId: 'user-1' });
        (Post.findByIdAndDelete as jest.Mock).mockResolvedValue({});

        const req = mockReq({ id: 'post-1' });
        const res = mockRes();

        await deletePost(req, res, 'user-1', false);

        expect(Post.findByIdAndDelete).toHaveBeenCalledWith('post-1');
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should allow an admin to delete any post', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ authorId: 'user-2' });
        (Post.findByIdAndDelete as jest.Mock).mockResolvedValue({});

        const req = mockReq({ id: 'post-1' });
        const res = mockRes();

        await deletePost(req, res, 'admin-1', true);

        expect(Post.findByIdAndDelete).toHaveBeenCalledWith('post-1');
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
