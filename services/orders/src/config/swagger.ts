import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de commande',
            version: '1.0.0',
            description: 'Documentation de l\'API de commande',
        },
        servers: [
            {
                url: '/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Chemin vers les fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;