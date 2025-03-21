// src/config/initAdmin.ts
import bcrypt from 'bcrypt';
import User from '../models/User';

export const initializeAdmin = async (): Promise<void> => {
    try {
        // Check if an admin already exists
        const adminExists = await User.findOne({
            where: { role: 'admin' }
        });

        // If no admin exists, create one
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            await User.create({
                name: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Failed to initialize admin user:', error);
    }
};