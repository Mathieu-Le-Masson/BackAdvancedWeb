// src/server.ts
import express from 'express';
import cors from 'cors';
import sequelize, { createDatabaseIfNotExists } from './config/database';
import routes from './routes';
import { initializeAdmin } from './config/initAdmin';
import { specs, swaggerUi } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start server with database initialization
const startServer = async () => {
    try {
        // First create the database if it doesn't exist
        await createDatabaseIfNotExists();

        // Then connect and sync models
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');

        // Initialize admin user
        await initializeAdmin();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();