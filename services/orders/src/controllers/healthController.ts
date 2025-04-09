import { Request, Response } from 'express';
import os from 'os';
import sequelize  from "../config/database";

export const getHealthStatus = async (req: Request, res: Response) => {
    console.log("Health check endpoint hit");
    try {
        // Vérification de la connexion à la base de données
        await sequelize.authenticate();
        const dbStatus = 'up';

        // Métriques système
        const uptime = process.uptime();
        const memoryUsage = process.memoryUsage();
        const freeMemory = os.freemem();
        const totalMemory = os.totalmem();
        const cpuLoad = os.loadavg();

        // Construction de la réponse
        const healthData = {
            status: 'up',
            timestamp: new Date().toISOString(),
            service: 'orders-service',
            checks: {
                database: dbStatus,
            },
            metrics: {
                uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
                memory: {
                    usage: {
                        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
                        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                    },
                    system: {
                        free: `${Math.round(freeMemory / 1024 / 1024)} MB`,
                        total: `${Math.round(totalMemory / 1024 / 1024)} MB`,
                        percentFree: `${Math.round((freeMemory / totalMemory) * 100)}%`,
                    }
                },
                cpu: {
                    load: cpuLoad,
                    description: {
                        "1min": `${cpuLoad[0].toFixed(2)} - Charge moyenne sur 1 minute`,
                        "5min": `${cpuLoad[1].toFixed(2)} - Charge moyenne sur 5 minutes`,
                        "15min": `${cpuLoad[2].toFixed(2)} - Charge moyenne sur 15 minutes`
                    }
                }
            }
        };

        res.json(healthData);
    } catch (error) {
        res.status(500).json({
            status: 'down',
            timestamp: new Date().toISOString(),
            service: 'order-service',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};