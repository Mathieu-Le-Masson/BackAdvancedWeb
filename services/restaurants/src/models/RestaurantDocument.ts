import mongoose, { Document, Schema } from 'mongoose';

interface IRestaurantDocument extends Document {
    _id: mongoose.Types.ObjectId;
    restaurantId: string;
    name: string;
    data: Buffer;
    contentType: string;
    createdAt: Date;
}

const RestaurantDocumentSchema = new Schema({
    restaurantId: { type: String, required: true },
    name: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const RestaurantDocument = mongoose.model<IRestaurantDocument>('RestaurantDocument', RestaurantDocumentSchema);

export default RestaurantDocument;