// src/routes/menuRoutes.ts
import express from 'express';
import MenuController from "../controllers/menuController";
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();
const menuController = new MenuController();

/**
 * @swagger
 * /menus:
 *   get:
 *     summary: Récupérer tous les menus
 *     tags: [Menus]
 *     responses:
 *       200:
 *         description: Liste des menus
 */
router.get('/', menuController.getAllMenus);

/**
 * @swagger
 * /menus/{id}:
 *   get:
 *     summary: Récupérer un menu par son ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu trouvé
 *       404:
 *         description: Menu non trouvé
 */
router.get('/:id', menuController.getMenuById);

/**
 * @swagger
 * /menus:
 *   post:
 *     summary: Créer un nouveau menu
 *     tags: [Menus]
 *     responses:
 *       201:
 *         description: Menu créé
 */
router.post('/', menuController.createMenu);

/**
 * @swagger
 * /menus/{id}:
 *   put:
 *     summary: Mettre à jour un menu
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu mis à jour
 *       404:
 *         description: Menu non trouvé
 */
router.put('/:id', menuController.updateMenu);

/**
 * @swagger
 * /menus/{id}:
 *   delete:
 *     summary: Supprimer un menu
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Menu supprimé
 *       404:
 *         description: Menu non trouvé
 */
router.delete('/:id', menuController.deleteMenu);

/**
 * @swagger
 * /menus/{id}/images:
 *   post:
 *     summary: Télécharger une image pour un menu
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image téléchargée
 *       404:
 *         description: Menu non trouvé
 */
router.post('/:id/images', upload.single('image'), menuController.uploadMenuImage);

/**
 * @swagger
 * /menus/{id}/images/{imageId}:
 *   get:
 *     summary: Récupérer une image de menu
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image
 *       404:
 *         description: Image non trouvée
 */
router.get('/:id/images/:imageId', menuController.getMenuImage);

/**
 * @swagger
 * /menus/{id}/images/{imageId}:
 *   delete:
 *     summary: Supprimer une image de menu
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image supprimée
 *       404:
 *         description: Image non trouvée
 */
router.delete('/:id/images/:imageId', menuController.deleteMenuImage);

router.get('/restaurant/:restaurantId', menuController.getMenusByRestaurantId);

export default router;