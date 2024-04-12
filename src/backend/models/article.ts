import mongoose, { Document } from 'mongoose';

interface IArticle extends Document {
    id: string;
    link: string;
    image: string;
    category: string;
    title: string;
    description: string;
    date: string;
    content: string;
}

const articleSchema = new mongoose.Schema({
    id: { type: String, required: true },
    link: { type: Date, required: true },
    image: { type: Date, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    content: { type: String, required: true },
});

const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);

export type { IArticle, articleSchema };
export default Article;
