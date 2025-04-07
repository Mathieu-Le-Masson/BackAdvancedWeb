import mongoose, { Document, Schema } from 'mongoose';

interface IMenuImage extends Document {
    _id: mongoose.Types.ObjectId;
    menuId: number;
    name: string;
    data: Buffer;
    contentType: string;
    createdAt?: Date;
}

const MenuImageSchema = new Schema({
    menuId: { type: Number, required: true },
    name: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MenuImage = mongoose.model<IMenuImage>('MenuImage', MenuImageSchema);

export default MenuImage;