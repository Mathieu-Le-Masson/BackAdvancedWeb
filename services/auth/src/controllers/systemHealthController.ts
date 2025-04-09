import { Request, Response } from 'express';
import axios from 'axios';
import { getHealthStatus } from './healthController'; // Import de votre fonction existante

export const getAllServicesHealth = async (req: Request, res: Response) => {
    try {
        // Services à vérifier
        const services = [
            { name: 'restaurant-service', url: 'http://restaurant-service:3000/api/restaurant-health/' },
            { name: 'orders-service', url: 'http://orders-service:3000/api/order-health/' },
            // Ajoutez d'autres services ici
        ];

        // Obtenez la santé du service d'auth directement
        let authHealth = null;
        const mockReq = {} as Request;
        const mockRes = {
            json: (data: any) => { authHealth = data; },
            status: (code: number) => ({ json: (data: any) => { authHealth = data; } })
        } as unknown as Response;

        await getHealthStatus(mockReq, mockRes);

        // Récupérez la santé des autres services
        const serviceHealthPromises = services.map(async (service) => {
            try {
                const response = await axios.get(service.url, {
                    timeout: 3000 // Timeout pour éviter d'attendre trop longtemps
                });
                return response.data;
            } catch (error) {
                return {
                    status: 'down',
                    timestamp: new Date().toISOString(),
                    service: service.name,
                    error: 'Service unavailable'
                };
            }
        });

        const servicesHealth = await Promise.all(serviceHealthPromises);

        // Combinez tous les résultats
        const allHealth = {
            timestamp: new Date().toISOString(),
            services: {
                auth: authHealth,
                ...servicesHealth.reduce((acc, health) => {
                    acc[health.service.replace('-service', '')] = health;
                    return acc;
                }, {})
            },
            overallStatus: [...servicesHealth, authHealth].every(h => h.status === 'up') ? 'up' : 'degraded'
        };

        res.json(allHealth);
    } catch (error) {
        console.error('Error fetching services health:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch services health',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};