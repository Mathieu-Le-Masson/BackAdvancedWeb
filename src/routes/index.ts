import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import addressRoutes from "./addressRoutes";

const router = express.Router();

// Routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/addresses', addressRoutes);

export default router;