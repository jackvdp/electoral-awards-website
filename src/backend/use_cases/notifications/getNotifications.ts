import Notification from 'backend/models/notification';

async function getNotifications(userId: string, limit: number = 30, unreadOnly: boolean = false) {
    const query: Record<string, any> = { recipientId: userId };

    if (unreadOnly) {
        query.read = false;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return notifications;
}

export default getNotifications;
