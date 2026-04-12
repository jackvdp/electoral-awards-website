import mongoose, { Document } from 'mongoose';

interface IComment extends Document {
    _id: string;
    postId: string;
    authorId: string;
    content: string;
    mentions: string[];
    likes: string[];
    status: 'active' | 'hidden' | 'flagged';
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new mongoose.Schema(
    {
        postId: { type: String, required: true, index: true },
        authorId: { type: String, required: true, index: true },
        content: { type: String, required: true, maxlength: 500 },
        mentions: [{ type: String }],
        likes: [{ type: String }],
        status: { type: String, enum: ['active', 'hidden', 'flagged'], default: 'active' },
    },
    { timestamps: true }
);

commentSchema.index({ postId: 1, createdAt: 1 });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

export type { IComment };
export default Comment;
