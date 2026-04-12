import toggleLike from 'backend/use_cases/feed/toggleLike';
import Post from 'backend/models/post';

jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: any = {}): any => ({ query });

describe('toggleLike', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if post does not exist', async () => {
        (Post.findById as jest.Mock).mockResolvedValue(null);

        const req = mockReq({ id: 'nonexistent' });
        const res = mockRes();

        await toggleLike(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('should add a like if not already liked', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ likes: [] });
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
        (Post.findById as jest.Mock)
            .mockResolvedValueOnce({ likes: [] })
            .mockReturnValue({ lean: jest.fn().mockResolvedValue({ likes: ['user-1'] }) });

        const req = mockReq({ id: 'post-1' });
        const res = mockRes();

        await toggleLike(req, res, 'user-1');

        expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('post-1', { $addToSet: { likes: 'user-1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ liked: true, likeCount: 1 });
    });

    it('should remove a like if already liked', async () => {
        (Post.findById as jest.Mock).mockResolvedValue({ likes: ['user-1'] });
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
        (Post.findById as jest.Mock)
            .mockResolvedValueOnce({ likes: ['user-1'] })
            .mockReturnValue({ lean: jest.fn().mockResolvedValue({ likes: [] }) });

        const req = mockReq({ id: 'post-1' });
        const res = mockRes();

        await toggleLike(req, res, 'user-1');

        expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('post-1', { $pull: { likes: 'user-1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ liked: false, likeCount: 0 });
    });
});
