import mongoose, { Document } from 'mongoose';

interface INotification extends Document {
    _id: string;
    recipientId: string;
    type: 'mention' | 'like_post' | 'like_comment' | 'comment' | 'reply';
    actorId: string;
    postId?: string;
    commentId?: string;
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new mongoose.Schema(
    {
        recipientId: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ['mention', 'like_post', 'like_comment', 'comment', 'reply'],
            required: true,
        },
        actorId: { type: String, required: true },
        postId: { type: String },
        commentId: { type: String },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

export type { INotification };
export default Notification;
