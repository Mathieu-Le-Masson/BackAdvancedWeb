// src/routes/menuRoutes.ts
import express from 'express';
import MenuController from "../controllers/menuController";

const router = express.Router();
const menuController = new MenuController();

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Récupérer tous les menus
 *     responses:
 *       200:
 *         description: Liste des menus
 */
router.get('/', menuController.getAllMenus);

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Récupérer un menu par son ID
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
 * /api/menus:
 *   post:
 *     summary: Créer un nouveau menu
 *     responses:
 *       201:
 *         description: Menu créé
 */
router.post('/', menuController.createMenu);

/**
 * @swagger
 * /api/menus/{id}:
 *   put:
 *     summary: Mettre à jour un menu
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
 * /api/menus/{id}:
 *   delete:
 *     summary: Supprimer un menu
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

export default router;