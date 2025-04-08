import express from 'express';
import mapRoutes from './routes/mapRoutes';
import sequelize, { createDatabaseIfNotExists } from './config/database';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/maps', mapRoutes);
app.use(cors({
    origin: 'http://localhost:5173/', // Autorise uniquement cette origine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    credentials: true // Si vous utilisez des cookies ou des en-têtes d'authentification
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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

