import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

// Update this interface to match your expected user properties
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        userType?: string;
    };
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Update the type assertion to match your expected user properties
        // Add user data to request
        (req as AuthRequest).user = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as {
            userId: number;
            email: string;
            userType?: string;
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorize = (userType: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        if (!req.user.userType || !userType.includes(req.user.userType)) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }

        next();
    };
};