import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/usersRoutes';
import sequelize, { createDatabaseIfNotExists } from './config/database';
import { initAdminUser } from './utils/initAdmin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route de base pour la racine
app.get('/', (req, res) => {
    res.send('Welcome to the Auth API');
});

async function startServer() {
    try {
        // Créer la base de données si elle n'existe pas
        await createDatabaseIfNotExists();

        // Connecter à la base de données
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès');

        // Synchroniser les modèles avec la base de données
        await sequelize.sync();
        console.log('Modèles synchronisés avec la base de données');

        // Initialiser l'utilisateur admin
        await initAdminUser();

        // Démarrer le serveur
        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
        });
    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}

// Utiliser une IIFE asynchrone pour gérer la promesse
(async () => {
    try {
        await startServer();
    } catch (error) {
        console.error('Erreur non gérée lors du démarrage:', error);
        process.exit(1);
    }
})();