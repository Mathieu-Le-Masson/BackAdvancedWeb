import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await userService.updateUserData(req.params.id, req.body);

        if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({
            message: 'Utilisateur mis à jour avec succès',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                firstName: updatedUser.firstName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                userType: updatedUser.userType,
                isActive: updatedUser.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await userService.removeUser(req.params.id);

        if (!deleted) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const getReferrals = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        const referrals = await userService.getUserReferrals(req.params.id);
        res.status(200).json(referrals);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.deactivateUserAccount(req.params.id);

        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }

        res.status(200).json({ message: 'Utilisateur désactivé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};