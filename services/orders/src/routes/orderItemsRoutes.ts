import { Router } from 'express';
import {
  createOrderItem,
  getOrderItemsByOrderId,
  deleteOrderItemsByOrderId,
  deleteOrderItemsById,
} from '../controllers/orderItemsController';

const router = Router();

router.post('/', createOrderItem);
// @ts-ignore
router.get('/:orderId', getOrderItemsByOrderId);
router.get('/')
router.delete('/:orderId', deleteOrderItemsByOrderId);
router.delete('/:id', deleteOrderItemsById);
export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'élément de commande
 *         orderId:
 *           type: integer
 *           description: ID de la commande associée
 *         articleId:
 *           type: integer
 *           nullable: true
 *           description: ID de l'article commandé (peut être null)
 *         menuId:
 *           type: integer
 *           nullable: true
 *           description: ID du menu commandé (peut être null)
 *         quantity:
 *           type: integer
 *           description: Quantité commandée
 */

/**
 * @swagger
 * /orderItems:
 *   post:
 *     summary: Crée un nouvel élément de commande
 *     tags: [OrderItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Élément de commande créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       500:
 *         description: Erreur serveur
 *
 * /orderItems/{orderId}:
 *   get:
 *     summary: Récupère les éléments d'une commande par son ID
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Liste des éléments de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Aucun élément trouvé pour cette commande
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprime les éléments d'une commande par son ID
 *     tags: [OrderItems]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       204:
 *         description: Éléments de commande supprimés avec succès
 *       404:
 *         description: Aucun élément trouvé pour cette commande
 *       500:
 *         description: Erreur serveur
 */