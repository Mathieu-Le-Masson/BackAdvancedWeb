import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Restaurant',
            version: '1.0.0',
            description: 'Documentation de l\'API Restaurant',
        },
        servers: [
            {
                url: '/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Indiquez le chemin vers vos fichiers de routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;