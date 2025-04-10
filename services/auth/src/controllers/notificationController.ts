import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            res.status(400).json({ message: 'L\'ID utilisateur et le message sont requis' });
            return;
        }

        const notification = await Notification.create({
            userId,
            message
        });

        res.status(201).json({
            message: 'Notification créée avec succès',
            notification
        });
    } catch (error) {
        console.error('Erreur lors de la création de la notification:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la création de la notification',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'L\'ID utilisateur est requis' });
            return;
        }

        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({
            notifications
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la récupération des notifications',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
    }
};