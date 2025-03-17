import { Router } from 'express';
import User from '../models/User';

const router = Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { name, email } = req.body;
            user.name = name;
            user.email = email;
            await user.save();
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
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