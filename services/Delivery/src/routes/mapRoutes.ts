import express, { Request, Response, NextFunction } from 'express';
import * as mapController from '../controllers/mapController';

const router = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * /maps/geocode:
 *   post:
 *     summary: Géocode une adresse en coordonnées GPS.
 *     tags:
 *       - Maps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 example: "10 rue de Paris, 75000 Paris"
 *     responses:
 *       200:
 *         description: Coordonnées GPS de l'adresse.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                 lng:
 *                   type: number
 *       400:
 *         description: Adresse manquante.
 *       404:
 *         description: Adresse introuvable.
 *       500:
 *         description: Erreur lors de la géolocalisation.
 */
router.post('/geocode', asyncHandler((req, res) => mapController.geocode(req, res)));

/**
 * @swagger
 * /maps/route:
 *   post:
 *     summary: Calcule un itinéraire entre deux adresses.
 *     tags:
 *       - Maps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *                 example: "10 rue de Paris, 75000 Paris"
 *               destination:
 *                 type: string
 *                 example: "20 avenue de Lyon, 69000 Lyon"
 *     responses:
 *       200:
 *         description: Détails de l'itinéraire.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distance:
 *                   type: number
 *                   description: Distance en kilomètres.
 *                 duration:
 *                   type: number
 *                   description: Durée en minutes.
 *       400:
 *         description: Origine ou destination manquante.
 *       500:
 *         description: Erreur lors du calcul de l'itinéraire.
 */
router.post('/route', asyncHandler((req, res) => mapController.route(req, res)));

/**
 * @swagger
 * /maps/delivery-zone:
 *   post:
 *     summary: Vérifie si une position est dans une zone de livraison.
 *     tags:
 *       - Maps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *                 example:
 *                   lat: 48.8566
 *                   lng: 2.3522
 *               zoneId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Résultat de la vérification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isInZone:
 *                   type: boolean
 *       400:
 *         description: Position ou ID de zone manquant.
 *       500:
 *         description: Erreur lors de la vérification de la zone de livraison.
 */
router.post('/delivery-zone', asyncHandler((req, res) => mapController.checkDeliveryZone(req, res)));

export default router;
