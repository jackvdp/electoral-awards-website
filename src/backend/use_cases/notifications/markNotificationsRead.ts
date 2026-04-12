import Notification from 'backend/models/notification';

async function markNotificationsRead(userId: string, notificationIds?: string[]): Promise<number> {
    const query: Record<string, any> = { recipientId: userId };

    if (notificationIds && notificationIds.length > 0) {
        query._id = { $in: notificationIds };
    } else {
        query.read = false;
    }

    const result = await Notification.updateMany(query, { $set: { read: true } });
    return result.modifiedCount;
}

export default markNotificationsRead;
