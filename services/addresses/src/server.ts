import express from 'express';
import addressRoutes from './routes/addressRoutes';
import sequelize from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/addresses', addressRoutes);

// Connexion à la base de données avec retries
const connectWithRetry = async () => {
    let retries = 5;
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log('Connexion à la base de données établie avec succès');

            // Synchroniser le modèle avec la base de données
            await sequelize.sync({ force: false });
            console.log('Base de données synchronisée');
            return true;
        } catch (err) {
            console.error('Erreur de connexion à la base de données:', err);
            retries -= 1;
            console.log(`Tentatives restantes: ${retries}`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    return false;
};

// Démarrer l'application
const startApp = async () => {
    const connected = await connectWithRetry();

    if (connected) {
        app.listen(PORT, () => {
            console.log(`Service d'adresses démarré sur le port ${PORT}`);
        });
    } else {
        console.error("Impossible de démarrer le serveur sans connexion à la base de données");
    }
};

// Utiliser une IIFE asynchrone pour gérer la promesse
(async () => {
    try {
        await startApp();
    } catch (error) {
        console.error('Erreur non gérée lors du démarrage:', error);
        process.exit(1);
    }
})();