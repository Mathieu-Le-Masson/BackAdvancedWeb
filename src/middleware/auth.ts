import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express, { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import dotenv from 'dotenv';

// Extend Request type globally
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email: string;
                role: string;
            }
        }
    }
}

dotenv.config();

const router = express.Router();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
const refreshTokens: string[] = [];

// Login route - don't return the res.json() call
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(401).json({ message: 'Email or password incorrect' });
            return;
        }

        // Include user role in token payload
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            accessTokenSecret,
            { expiresIn: '20m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            refreshTokenSecret
        );

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
});

// Token refresh route - don't return the res calls
router.post('/token', (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }

    if (!refreshTokens.includes(token)) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }

    jwt.verify(token, refreshTokenSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }

        const accessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, role: decoded.role },
            accessTokenSecret,
            { expiresIn: '20m' }
        );

        res.json({ accessToken });
    });
});

// Logout functionality - don't return the res call
router.post('/logout', (req: Request, res: Response) => {
    const { token } = req.body;

    if (token) {
        const tokenIndex = refreshTokens.indexOf(token);
        if (tokenIndex !== -1) {
            refreshTokens.splice(tokenIndex, 1);
        }
    }

    res.status(200).json({ message: 'Logged out successfully' });
});

// Authentication middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No authentication token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            res.status(403).json({ message: 'Token invalid or expired' });
            return;
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    });
};

// Admin authorization middleware
const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }

    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }

    next();
};

export { router as authRouter, authenticateJWT, isAdmin };