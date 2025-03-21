// src/middleware/authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            } else {
                req.user = { userId: (decoded as any).userId };
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};