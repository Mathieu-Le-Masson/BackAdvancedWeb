import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import sequelize, { createDatabaseIfNotExists } from './config/database';
import connectMongoDB from './config/mongodb';
import restaurantRoutes from "./routes/restaurantRoutes";
import menuRoutes from "./routes/menuRoutes";
import articleRoutes from "./routes/articleRoutes";
import swaggerSpec from './config/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({credentials: true}));

app.use(express.json());
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/articles', articleRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route de base pour la racine
app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant API');
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

        // Connecter à MongoDB
        await connectMongoDB();

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