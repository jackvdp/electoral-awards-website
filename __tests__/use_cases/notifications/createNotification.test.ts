import createNotification from 'backend/use_cases/notifications/createNotification';
import Notification from 'backend/models/notification';

jest.mock('backend/models/notification');

describe('createNotification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a notification', async () => {
        const saved = {
            _id: 'n1',
            recipientId: 'user-2',
            type: 'mention',
            actorId: 'user-1',
            postId: 'post-1',
        };

        (Notification as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(saved),
            ...saved,
        }));

        const result = await createNotification({
            recipientId: 'user-2',
            type: 'mention',
            actorId: 'user-1',
            postId: 'post-1',
        });

        expect(result).toBeTruthy();
    });

    it('should not create a notification when actor and recipient are the same', async () => {
        const result = await createNotification({
            recipientId: 'user-1',
            type: 'like_post',
            actorId: 'user-1',
            postId: 'post-1',
        });

        expect(result).toBeNull();
        expect(Notification).not.toHaveBeenCalled();
    });

    it('should pass commentId when provided', async () => {
        let capturedData: any = null;
        (Notification as any).mockImplementation((data: any) => {
            capturedData = data;
            return { save: jest.fn().mockResolvedValue(data), ...data };
        });

        await createNotification({
            recipientId: 'user-2',
            type: 'comment',
            actorId: 'user-1',
            postId: 'post-1',
            commentId: 'comment-1',
        });

        expect(capturedData.commentId).toBe('comment-1');
    });
});
