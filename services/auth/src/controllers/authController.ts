import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sequelize from '../config/database';
import User from '../models/User';
import UserAddress from '../models/UserAddress';

export const authenticate = (req: Request, res: Response): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({message: 'Token manquant'});
            return;
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Si on arrive ici, le token est valide
        res.status(200).send();
    } catch (error) {
        res.status(401).json({message: 'Token invalide'});
    }
};


export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, firstName, email, password, userType, phone, refCode, address} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            res.status(400).json({message: 'User already exists'});
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate referral code
        const referralCode = crypto.randomBytes(6).toString('hex');

        // Démarrer une transaction pour garantir la cohérence des données
        const transaction = await sequelize.transaction();

        try {
            let addressId = null;

            // Si une adresse est fournie, la créer d'abord
            if (address) {
                const newAddress = await UserAddress.create({
                    streetNumber: address.streetNumber,
                    street: address.street,
                    complement: address.complement || null,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: address.country
                }, { transaction });

                addressId = newAddress.id;
            }

            // Create user with address reference
            const user = await User.create({
                name,
                firstName,
                email,
                password: hashedPassword,
                userType,
                referralCode,
                phone,
                addressId,
                referredBy: refCode ?
                    (await User.findOne({where: {referralCode: refCode}}))?.id :
                    null
            }, { transaction });

            await transaction.commit();

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    email: user.email,
                    phone: user.phone,
                    userType: user.userType,
                    referralCode: user.referralCode,
                    referredBy: user.referredBy,
                    addressId: user.addressId
                }
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({where: {email}});
        if (!user) {
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(401).json({message: 'Account is deactivated'});
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }

        // Generate tokens
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,  // Add email to match your type definition
                userType: user.userType
            },
            process.env.JWT_SECRET || 'your-secret-key',
            {expiresIn: '1h'}
        );

        const refreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                firstName: user.firstName,
                email: user.email,
                phone: user.phone,
                userType: user.userType
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const {refreshToken: token} = req.body;

        // Check if refresh token is provided
        if (!token) {
            res.status(400).json({message: 'Refresh token is required'});
            return;
        }

        // Verify refresh token
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
            ) as { userId: string };

            // Find user
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                res.status(404).json({message: 'UserRoutes not found'});
                return;
            }

            // Check if user is active
            if (!user.isActive) {
                res.status(401).json({message: 'Account is deactivated'});
                return;
            }

            // Generate new access token
            const accessToken = jwt.sign(
                {userId: user.id, userType: user.userType},
                process.env.JWT_SECRET || 'your-secret-key',
                {expiresIn: '1h'}
            );

            res.status(200).json({
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    email: user.email,
                    phone: user.phone,
                    userType: user.userType
                }
            });
        } catch (error) {
            res.status(401).json({message: 'Invalid or expired refresh token'});
            return;
        }
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};