import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password@mongodb:27017/restaurants?authSource=admin';

const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connexion à MongoDB établie avec succès');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        throw error;
    }
};

export default connectMongoDB;