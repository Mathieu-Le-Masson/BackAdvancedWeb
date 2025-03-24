import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

// Routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);

export default router;