import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API d\'Authentification',
            version: '1.0.0',
            description: 'Documentation de l\'API d\'Authentification',
        },
        servers: [
            {
                url: '/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Chemin vers vos fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;