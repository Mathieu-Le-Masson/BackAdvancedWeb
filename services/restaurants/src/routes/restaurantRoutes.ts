import express, { RequestHandler } from 'express';
import RestaurantController from '../controllers/restaurantController';

const router = express.Router();
const restaurantController = new RestaurantController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du restaurant
 *         name:
 *           type: string
 *           description: Nom du restaurant
 *         description:
 *           type: string
 *           description: Description du restaurant
 *         isActive:
 *           type: boolean
 *           description: Indique si le restaurant est actif
 *         ownerId:
 *           type: string
 *           description: ID du propriétaire du restaurant
 *     RestaurantAddress:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         zipCode:
 *           type: string
 *         country:
 *           type: string
 *         restaurantId:
 *           type: string
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Créer un nouveau restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', restaurantController.createRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Récupérer un restaurant par son ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Restaurant récupéré avec succès
 *       404:
 *         description: Restaurant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Récupérer tous les restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtre sur le statut actif des restaurants
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *         description: Filtre sur l'ID du propriétaire
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Recherche par nom
 *     responses:
 *       200:
 *         description: Liste des restaurants récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Mettre à jour un restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant mis à jour avec succès
 *       404:
 *         description: Restaurant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', restaurantController.updateRestaurant);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Supprimer un restaurant
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Restaurant supprimé avec succès
 *       404:
 *         description: Restaurant non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', restaurantController.deleteRestaurant);

export default router;