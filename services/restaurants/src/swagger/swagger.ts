import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Restaurants',
            version: '1.0.0',
            description: 'Documentation de l\'API pour la gestion des restaurants',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJSDoc(options);

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};