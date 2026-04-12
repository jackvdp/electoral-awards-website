import createPost from 'backend/use_cases/feed/createPost';
import Post from 'backend/models/post';

// Mock Mongoose model
jest.mock('backend/models/post');

const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReq = (body: any = {}): any => ({ body });

describe('createPost', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if content is empty', async () => {
        const req = mockReq({ content: '' });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post content is required' });
    });

    it('should return 400 if content is missing', async () => {
        const req = mockReq({});
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post content is required' });
    });

    it('should return 400 if content exceeds 1000 characters', async () => {
        const req = mockReq({ content: 'a'.repeat(1001) });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post content must be 1000 characters or fewer' });
    });

    it('should return 429 if user has posted 10 times in the last hour', async () => {
        (Post.countDocuments as jest.Mock).mockResolvedValue(10);

        const req = mockReq({ content: 'Hello world' });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ message: 'You can only create 10 posts per hour' });
    });

    it('should create a post successfully', async () => {
        (Post.countDocuments as jest.Mock).mockResolvedValue(0);

        const savedPost = {
            _id: 'post-1',
            authorId: 'user-1',
            content: 'Hello world',
            type: 'text',
            mentions: [],
            likes: [],
            commentCount: 0,
            status: 'active',
        };

        (Post as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(savedPost),
            ...savedPost,
        }));

        const req = mockReq({ content: 'Hello world' });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should trim whitespace from content', async () => {
        (Post.countDocuments as jest.Mock).mockResolvedValue(0);

        let capturedContent = '';
        (Post as any).mockImplementation((data: any) => {
            capturedContent = data.content;
            return { save: jest.fn().mockResolvedValue(data), ...data };
        });

        const req = mockReq({ content: '  Hello world  ' });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(capturedContent).toBe('Hello world');
    });

    it('should default type to text', async () => {
        (Post.countDocuments as jest.Mock).mockResolvedValue(0);

        let capturedType = '';
        (Post as any).mockImplementation((data: any) => {
            capturedType = data.type;
            return { save: jest.fn().mockResolvedValue(data), ...data };
        });

        const req = mockReq({ content: 'Hello world' });
        const res = mockRes();

        await createPost(req, res, 'user-1');

        expect(capturedType).toBe('text');
    });
});
