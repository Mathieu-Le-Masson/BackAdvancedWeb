import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sequelize from '../config/database';
import User from '../models/User';
import UserAddress from '../models/UserAddress';

export const authenticate = (req: Request, res: Response): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({message: 'Token manquant'});
            return;
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Si on arrive ici, le token est valide
        res.status(200).send();
    } catch (error) {
        res.status(401).json({message: 'Token invalide'});
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, firstName, email, password, userType, phone, referralCode: refCode, address, addressString, siretNumber, IBAN} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            res.status(400).json({message: 'User already exists'});
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate referral code
        const referralCode = crypto.randomBytes(6).toString('hex');

        // Démarrer une transaction pour garantir la cohérence des données
        const transaction = await sequelize.transaction();
        let user;

        try {
            let addressId = null;

            // Si une adresse est fournie, la créer d'abord
            if (address) {
                const newAddress = await UserAddress.create({
                    streetNumber: address.streetNumber,
                    street: address.street,
                    complement: address.complement || null,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: address.country
                }, { transaction });

                addressId = newAddress.id;
            }

            // Create user with address reference
            user = await User.create({
                name,
                firstName,
                email,
                password: hashedPassword,
                userType,
                referralCode,
                phone,
                address: addressId,
                addressString: addressString,
                IBAN: IBAN,
                siretNumber: siretNumber,
                referredBy: refCode ?
                    (await User.findOne({where: {referralCode: refCode}}))?.id :
                    null
            }, { transaction });

            await transaction.commit();
        } catch (innerError) {
            await transaction.rollback();
            // Plutôt que de relancer l'erreur, on la traite ici directement
            res.status(500).json({message: 'Transaction error', error: innerError});
            return;
        }

        // Log user registration
        const fs = require('fs');
        const logFilePath = process.env.LOG_FILE_PATH || '/tmp/auth_logs.log';
        const logMessage = `${new Date().toISOString()} - Inscription - ID: ${user.id} - Email: ${email}\n`;
        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                referralCode: user.referralCode,
                referredBy: user.referredBy,
                address: user.address,
                addressString: user.addressString,
                IBAN: user.IBAN,
                siretNumber: user.siretNumber,
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};


export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({where: {email}});
        if (!user) {
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(401).json({message: 'Account is deactivated'});
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({message: 'Invalid credentials'});
            return;
        }

        // Generate tokens
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                userType: user.userType
            },
            process.env.JWT_SECRET || 'your-secret-key',
            {expiresIn: '1h'}
        );

        const refreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            {expiresIn: '7d'}
        );

        // Log user login
        const fs = require('fs');
        const logFilePath = process.env.LOG_FILE_PATH || '/tmp/auth_logs.log';
        const logMessage = `${new Date().toISOString()} - Connexion - ID: ${user.id} - Email: ${email}\n`;
        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                referralCode: user.referralCode,
                addressString: user.addressString,
                IBAN: user.IBAN,
                siretNumber: user.siretNumber,
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const {refreshToken: token} = req.body;

        // Check if refresh token is provided
        if (!token) {
            res.status(400).json({message: 'Refresh token is required'});
            return;
        }

        // Verify refresh token
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
            ) as { userId: string };

            // Find user
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                res.status(404).json({message: 'UserRoutes not found'});
                return;
            }

            // Check if user is active
            if (!user.isActive) {
                res.status(401).json({message: 'Account is deactivated'});
                return;
            }

            // Generate new access token
            const accessToken = jwt.sign(
                {userId: user.id, userType: user.userType},
                process.env.JWT_SECRET || 'your-secret-key',
                {expiresIn: '1h'}
            );

            res.status(200).json({
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    firstName: user.firstName,
                    email: user.email,
                    phone: user.phone,
                    userType: user.userType
                }
            });
        } catch (error) {
            res.status(401).json({message: 'Invalid or expired refresh token'});
            return;
        }
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
};

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Utilisez le module fs pour lire un fichier de logs temporaire
        const fs = require('fs');
        const logFilePath = process.env.LOG_FILE_PATH || '/tmp/auth_logs.log';

        // Vérifiez si le fichier existe, sinon créez-le
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '--- Début des logs ---\n');
        }

        // Lisez le contenu du fichier
        fs.readFile(logFilePath, 'utf8', (err: any, data: string) => {
            if (err) {
                res.status(500).json({ message: 'Erreur lors de la lecture des logs', error: err.message });
                return;
            }

            // Envoi des logs au format texte brut
            res.setHeader('Content-Type', 'text/plain');
            res.send(data || 'Aucun log disponible');
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur serveur', error: errorMessage });
    }
};

export const logGithubAccess = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userName } = req.body;

        if (!userName) {
            res.status(400).json({ message: 'Le nom d\'utilisateur est requis' });
            return;
        }

        // Écriture dans le fichier de logs
        const fs = require('fs');
        const logFilePath = process.env.GITHUB_LOG_FILE_PATH || '/tmp/github_access_logs.log';
        const logMessage = `${new Date().toISOString()} - Accès GitHub - User: ${userName}\n`;

        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage);

        res.status(200).json({ message: 'Accès au repository GitHub enregistré avec succès' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'accès GitHub', error: errorMessage });
    }
};

export const getGithubLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        // Utilisation du module fs pour lire le fichier de logs GitHub
        const fs = require('fs');
        const logFilePath = process.env.GITHUB_LOG_FILE_PATH || '/tmp/github_access_logs.log';

        // Vérifier si le fichier existe, sinon le créer
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '--- Début des logs d\'accès GitHub ---\n');
        }

        // Lire le contenu du fichier
        fs.readFile(logFilePath, 'utf8', (err: any, data: string) => {
            if (err) {
                res.status(500).json({ message: 'Erreur lors de la lecture des logs GitHub', error: err.message });
                return;
            }

            // Envoi des logs au format texte brut avec en-tête pour téléchargement
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', 'attachment; filename="github_access_logs.log"');
            res.send(data || 'Aucun log d\'accès GitHub disponible');
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur serveur', error: errorMessage });
    }
};