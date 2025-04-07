import mongoose, { Document, Schema } from 'mongoose';

interface IArticleImage extends Document {
    _id: mongoose.Types.ObjectId;
    articleId: number;
    name: string;
    data: Buffer;
    contentType: string;
    createdAt?: Date;
}

const ArticleImageSchema = new Schema({
    articleId: { type: Number, required: true },
    name: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ArticleImage = mongoose.model<IArticleImage>('ArticleImage', ArticleImageSchema);

export default ArticleImage;