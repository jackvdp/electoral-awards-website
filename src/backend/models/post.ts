import mongoose, { Document } from 'mongoose';

interface IPost extends Document {
    _id: string;
    authorId: string;
    content: string;
    type: 'text' | 'link' | 'article_share' | 'event_share';
    linkPreview?: {
        url: string;
        title?: string;
        description?: string;
        image?: string;
    };
    sharedArticleId?: string;
    sharedEventId?: string;
    mentions: string[];
    likes: string[];
    commentCount: number;
    status: 'active' | 'hidden' | 'flagged';
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema(
    {
        authorId: { type: String, required: true, index: true },
        content: { type: String, required: true, maxlength: 1000 },
        type: { type: String, enum: ['text', 'link', 'article_share', 'event_share'], default: 'text' },
        linkPreview: {
            url: String,
            title: String,
            description: String,
            image: String,
        },
        sharedArticleId: { type: String },
        sharedEventId: { type: String },
        mentions: [{ type: String }],
        likes: [{ type: String }],
        commentCount: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'hidden', 'flagged'], default: 'active' },
    },
    { timestamps: true }
);

postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ mentions: 1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export type { IPost };
export default Post;
