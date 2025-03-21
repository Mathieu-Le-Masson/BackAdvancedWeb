// src/routes/users.ts
import { Router } from 'express';
import User from '../models/User';
import { authenticateJWT, isAdmin } from '../middleware/auth';
import { checkAdmin } from '../middleware/checkAdmin';
import bcrypt from 'bcrypt';

const router = Router();

// Create a new user (admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword, role });
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read all users (admin only)
router.get('/', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single user by ID (admin only)
router.get('/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'role'] },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID (admin only)
router.put('/:id', authenticateJWT,isAdmin,  async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { name, email, password } = req.body;
            user.name = name;
            user.email = email;
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }
            await user.save();
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user by ID (admin only)
router.delete('/:id', authenticateJWT, isAdmin, checkAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).send('User not found');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;