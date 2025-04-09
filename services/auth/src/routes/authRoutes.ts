import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - name
 *         - firstName
 *         - email
 *         - password
 *         - userType
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'utilisateur
 *         firstName:
 *           type: string
 *           description: Prénom de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe de l'utilisateur
 *         userType:
 *           type: string
 *           description: Type d'utilisateur (client, admin, etc.)
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         refCode:
 *           type: string
 *           description: Code de parrainage (optionnel)
 *         address:
 *           type: object
 *           properties:
 *             streetNumber:
 *               type: string
 *             street:
 *               type: string
 *             complement:
 *               type: string
 *             postalCode:
 *               type: string
 *             city:
 *               type: string
 *             country:
 *               type: string
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe de l'utilisateur
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Token de rafraîchissement
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     userType:
 *                       type: string
 *                     referralCode:
 *                       type: string
 *                     referredBy:
 *                       type: string
 *                     address:
 *                       type: string
 *
 *       400:
 *         description: Utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     userType:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Identifiants invalides ou compte désactivé
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renouvellement du token d'accès
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token d'accès renouvelé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     userType:
 *                       type: string
 *       400:
 *         description: Token de rafraîchissement manquant
 *       401:
 *         description: Token de rafraîchissement invalide ou expiré
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /auth/authenticate:
 *   get:
 *     summary: Vérification de l'authenticité du token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/authenticate', authController.authenticate);


router.get('/logs', authController.getLogs);

router.post('/log-component-download', authController.logGithubAccess);

router.get('/get-component-log', authController.getGithubLogs);

export default router;