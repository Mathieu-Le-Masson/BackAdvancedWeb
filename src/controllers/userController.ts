// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Handle password update separately
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.update(req.body);

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user.id,
                name: user.name,
                firstName: user.firstName,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Soft delete - just mark as inactive
        await user.update({ isActive: false });

        res.status(200).json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getReferrals = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const referrals = await User.findAll({
            where: { referredBy: user.id },
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};