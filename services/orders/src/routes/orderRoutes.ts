// src/routes/orderRoutes.ts
import { Router } from 'express';
import OrderController from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/delivery', orderController.updateDeliveryInfo);
router.delete('/:id', orderController.deleteOrder);

export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la commande
 *         orderNumber:
 *           type: integer
 *           description: Numéro de la commande
 *         clientId:
 *           type: string
 *           description: ID du client ayant passé la commande
 *         price:
 *           type: number
 *           format: float
 *           description: Prix de la commande
 *         distance:
 *           type: number
 *           format: float
 *           description: Distance de livraison en kilomètres
 *         duration:
 *           type: number
 *           format: float
 *           description: Durée estimée de la livraison en minutes
 *         delivererId:
 *           type: string
 *           description: ID du livreur
 *         deliveryId:
 *           type: string
 *           description: ID de la livraison
 *         status:
 *           type: string
 *           enum: [pending, preparing, ready, delivering, delivered, cancelled]
 *           description: Statut de la commande
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Montant total de la commande
 *         origin:
 *           type: string
 *           description: Adresse d'origine
 *         destination:
 *           type: string
 *           description: Adresse de destination
 *         deliveryPrice:
 *           type: number
 *           format: float
 *           description: Prix de la livraison
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la commande
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour de la commande
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupère toutes les commandes
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: filters
 *         schema:
 *           type: object
 *         description: Filtres pour récupérer les commandes
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 *
 * /orders/{id}:
 *   get:
 *     summary: Récupère une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Met à jour une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprime une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 *
 * /orders/{id}/status:
 *   patch:
 *     summary: Met à jour le statut d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, delivering, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 *
 * /orders/{id}/delivery:
 *   patch:
 *     summary: Met à jour les informations de livraison d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivererId:
 *                 type: string
 *               price:
 *                 type: number
 *               distance:
 *                 type: number
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Informations de livraison mises à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */