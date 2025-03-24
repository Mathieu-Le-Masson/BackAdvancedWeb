// src/config/initAdmin.ts
import User from '../models/User';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const initializeAdmin = async () => {
    try {
        // Check if admin user already exists
        const adminExists = await User.findOne({
            where: {
                email: process.env.ADMIN_EMAIL || 'admin@example.com',
                userType: 'admin'
            }
        });

        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Generate referral code using crypto (same as in authController)
        const referralCode = crypto.randomBytes(6).toString('hex');

        await User.create({
            name: 'Administrator',
            firstName: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            phone: '0123456789',
            password: hashedPassword,
            userType: 'admin',
            isActive: true,
            referralCode,
            referredBy: null
        });

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error initializing admin user:', error);
        throw error;
    }
};