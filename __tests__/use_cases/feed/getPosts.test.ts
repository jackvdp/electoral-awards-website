import getPosts from 'backend/use_cases/feed/getPosts';
import Post from 'backend/models/post';

jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (query: any = {}): any => ({ query });

describe('getPosts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch posts sorted by createdAt descending', async () => {
        const mockPosts = [
            { _id: 'post-2', content: 'Second', createdAt: new Date() },
            { _id: 'post-1', content: 'First', createdAt: new Date(Date.now() - 1000) },
        ];

        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockPosts),
        };
        (Post.find as jest.Mock).mockReturnValue(chainMock);

        const req = mockReq({});
        const res = mockRes();

        await getPosts(req, res);

        expect(Post.find).toHaveBeenCalledWith({ status: 'active' });
        expect(chainMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(chainMock.limit).toHaveBeenCalledWith(20);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ posts: mockPosts, hasMore: false });
    });

    it('should use cursor-based pagination with before parameter', async () => {
        const before = '2026-01-01T00:00:00.000Z';

        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([]),
        };
        (Post.find as jest.Mock).mockReturnValue(chainMock);

        const req = mockReq({ before });
        const res = mockRes();

        await getPosts(req, res);

        expect(Post.find).toHaveBeenCalledWith({
            status: 'active',
            createdAt: { $lt: new Date(before) },
        });
    });

    it('should respect custom limit but cap at 50', async () => {
        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([]),
        };
        (Post.find as jest.Mock).mockReturnValue(chainMock);

        const req = mockReq({ limit: '100' });
        const res = mockRes();

        await getPosts(req, res);

        expect(chainMock.limit).toHaveBeenCalledWith(50);
    });

    it('should set hasMore to true when posts match the limit', async () => {
        const posts = Array.from({ length: 20 }, (_, i) => ({ _id: `post-${i}` }));

        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(posts),
        };
        (Post.find as jest.Mock).mockReturnValue(chainMock);

        const req = mockReq({});
        const res = mockRes();

        await getPosts(req, res);

        expect(res.json).toHaveBeenCalledWith({ posts, hasMore: true });
    });
});
