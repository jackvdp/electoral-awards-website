import getNotifications from 'backend/use_cases/notifications/getNotifications';
import Notification from 'backend/models/notification';

jest.mock('backend/models/notification');

describe('getNotifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch notifications for a user sorted by newest first', async () => {
        const mockNotifications = [
            { _id: 'n2', recipientId: 'user-1', type: 'like_post', createdAt: new Date() },
            { _id: 'n1', recipientId: 'user-1', type: 'mention', createdAt: new Date(Date.now() - 1000) },
        ];

        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockNotifications),
        };
        (Notification.find as jest.Mock).mockReturnValue(chainMock);

        const result = await getNotifications('user-1');

        expect(Notification.find).toHaveBeenCalledWith({ recipientId: 'user-1' });
        expect(chainMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(chainMock.limit).toHaveBeenCalledWith(30);
        expect(result).toEqual(mockNotifications);
    });

    it('should support a custom limit', async () => {
        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([]),
        };
        (Notification.find as jest.Mock).mockReturnValue(chainMock);

        await getNotifications('user-1', 10);

        expect(chainMock.limit).toHaveBeenCalledWith(10);
    });

    it('should filter by unread only', async () => {
        const chainMock = {
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue([]),
        };
        (Notification.find as jest.Mock).mockReturnValue(chainMock);

        await getNotifications('user-1', 30, true);

        expect(Notification.find).toHaveBeenCalledWith({ recipientId: 'user-1', read: false });
    });
});
