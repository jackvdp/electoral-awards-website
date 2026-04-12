import deleteComment from 'backend/use_cases/feed/deleteComment';
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

const mockReq = (query: any = {}): any => ({ query });

describe('deleteComment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if comment does not exist', async () => {
        (Comment.findById as jest.Mock).mockResolvedValue(null);

        const req = mockReq({ commentId: 'nonexistent' });
        const res = mockRes();

        await deleteComment(req, res, 'user-1', false);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user is not the author and not admin', async () => {
        (Comment.findById as jest.Mock).mockResolvedValue({ authorId: 'user-2', postId: 'post-1' });

        const req = mockReq({ commentId: 'comment-1' });
        const res = mockRes();

        await deleteComment(req, res, 'user-1', false);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow the author to delete their comment and decrement count', async () => {
        (Comment.findById as jest.Mock).mockResolvedValue({ authorId: 'user-1', postId: 'post-1' });
        (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue({});
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const req = mockReq({ commentId: 'comment-1' });
        const res = mockRes();

        await deleteComment(req, res, 'user-1', false);

        expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment-1');
        expect(Post.findByIdAndUpdate).toHaveBeenCalledWith('post-1', { $inc: { commentCount: -1 } });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should allow an admin to delete any comment', async () => {
        (Comment.findById as jest.Mock).mockResolvedValue({ authorId: 'user-2', postId: 'post-1' });
        (Comment.findByIdAndDelete as jest.Mock).mockResolvedValue({});
        (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

        const req = mockReq({ commentId: 'comment-1' });
        const res = mockRes();

        await deleteComment(req, res, 'admin-1', true);

        expect(Comment.findByIdAndDelete).toHaveBeenCalledWith('comment-1');
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
