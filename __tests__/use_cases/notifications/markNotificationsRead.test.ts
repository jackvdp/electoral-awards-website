import markNotificationsRead from 'backend/use_cases/notifications/markNotificationsRead';
import Notification from 'backend/models/notification';

jest.mock('backend/models/notification');

describe('markNotificationsRead', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should mark all notifications as read for a user', async () => {
        (Notification.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 5 });

        const result = await markNotificationsRead('user-1');

        expect(Notification.updateMany).toHaveBeenCalledWith(
            { recipientId: 'user-1', read: false },
            { $set: { read: true } }
        );
        expect(result).toBe(5);
    });

    it('should mark specific notifications as read', async () => {
        (Notification.updateMany as jest.Mock).mockResolvedValue({ modifiedCount: 2 });

        const result = await markNotificationsRead('user-1', ['n1', 'n2']);

        expect(Notification.updateMany).toHaveBeenCalledWith(
            { recipientId: 'user-1', _id: { $in: ['n1', 'n2'] } },
            { $set: { read: true } }
        );
        expect(result).toBe(2);
    });
});
