// src/routes/addressRoutes.ts
import express from 'express';
import * as addressController from '../controllers/addressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all address routes
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - streetNumber
 *         - street
 *         - postalCode
 *         - city
 *         - country
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the address
 *         streetNumber:
 *           type: string
 *           description: The street number
 *         complement:
 *           type: string
 *           description: Additional address information
 *         street:
 *           type: string
 *           description: Street name
 *         postalCode:
 *           type: string
 *           description: Postal code
 *         city:
 *           type: string
 *           description: City name
 *         country:
 *           type: string
 *           description: Country name
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Returns all addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
router.get('/', authenticate, addressController.getAddresses);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get an address by id
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address id
 *     responses:
 *       200:
 *         description: Address object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Address not found
 */
router.get('/:id', authenticate, addressController.getAddressById);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - streetNumber
 *               - street
 *               - postalCode
 *               - city
 *               - country
 *             properties:
 *               streetNumber:
 *                 type: string
 *               complement:
 *                 type: string
 *               street:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, addressController.createAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put('/:id', addressController.updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address id
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', addressController.deleteAddress);

export default router;