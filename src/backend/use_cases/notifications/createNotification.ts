import Notification from 'backend/models/notification';

interface CreateNotificationInput {
    recipientId: string;
    type: 'mention' | 'like_post' | 'like_comment' | 'comment' | 'reply';
    actorId: string;
    postId?: string;
    commentId?: string;
}

async function createNotification(input: CreateNotificationInput) {
    // Don't notify yourself
    if (input.recipientId === input.actorId) {
        return null;
    }

    const notification = new Notification({
        recipientId: input.recipientId,
        type: input.type,
        actorId: input.actorId,
        postId: input.postId,
        commentId: input.commentId,
    });

    await notification.save();
    return notification;
}

export type { CreateNotificationInput };
export default createNotification;
