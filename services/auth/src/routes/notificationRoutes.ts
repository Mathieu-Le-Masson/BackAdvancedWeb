import express from 'express';
import * as notificationController from '../controllers/notificationController';

const router = express.Router();

// Créer une nouvelle notification
router.post('/', notificationController.createNotification);

// Récupérer les 5 dernières notifications d'un utilisateur
router.get('/user/:userId', notificationController.getUserNotifications);
// Récupérer les 3 dernières notifications de livraison
router.get('/livreur', notificationController.getDeliveryNotifications);

export default router;