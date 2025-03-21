// src/middleware/checkAdmin.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const checkAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(403).json({ message: 'Forbidden: Admins only' });
        return;
    }

    const userId = req.user.userId;
    const user = await User.findByPk(userId);

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};