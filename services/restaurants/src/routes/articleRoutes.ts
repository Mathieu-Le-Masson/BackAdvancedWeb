// src/routes/articleRoutes.ts
import express from 'express';
import ArticleController from "../controllers/articleController";
import upload from "../middlewares/uploadMiddleware";

const router = express.Router();
const articleController = new ArticleController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - menuId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'article
 *         name:
 *           type: string
 *           description: Nom de l'article
 *         description:
 *           type: string
 *           description: Description de l'article
 *         price:
 *           type: number
 *           format: float
 *           description: Prix de l'article
 *         menuId:
 *           type: integer
 *           description: ID du menu auquel appartient l'article
 *         imageUrl:
 *           type: string
 *           description: URL de l'image de l'article
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'article
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour de l'article
 *     ArticleInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - menuId
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'article
 *         description:
 *           type: string
 *           description: Description de l'article
 *         price:
 *           type: number
 *           format: float
 *           description: Prix de l'article
 *         menuId:
 *           type: integer
 *           description: ID du menu auquel appartient l'article
 *         imageUrl:
 *           type: string
 *           description: URL de l'image de l'article
 */

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API de gestion des articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Créer un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erreur serveur
 */
router.post('/', articleController.createArticle);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Mettre à jour un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', articleController.updateArticle);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'article
 *     responses:
 *       204:
 *         description: Article supprimé
 *       404:
 *         description: Article non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', articleController.deleteArticle);

/**
 * @swagger
 * /articles/{id}/images:
 *   post:
 *     summary: Télécharger une image pour un article
 *     tags: [Articles]
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
 *         description: Article non trouvé
 */
router.post('/:id/images', upload.single('image'), articleController.uploadArticleImage);

/**
 * @swagger
 * /articles/{id}/images/{imageId}:
 *   get:
 *     summary: Récupérer une image d'article
 *     tags: [Articles]
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
router.get('/:id/images/:imageId', articleController.getArticleImage);

/**
 * @swagger
 * /articles/{id}/images/{imageId}:
 *   delete:
 *     summary: Supprimer une image d'article
 *     tags: [Articles]
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
router.delete('/:id/images/:imageId', articleController.deleteArticleImage);

export default router;