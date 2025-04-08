import { Request, Response } from 'express';
import * as mapService from '../services/mapsService'; // Assurez-vous que le chemin est correct

export const geocode = async (req: Request, res: Response) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ message: 'Adresse manquante' });
        }

        const location = await mapService.geocodeAddress(address);
        if (!location) {
            return res.status(404).json({ message: 'Adresse introuvable' });
        }

        res.status(200).json(location);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erreur lors de la géolocalisation', error: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la géolocalisation', error: 'Erreur inconnue' });
        }
    }
};

export const route = async (req: Request, res: Response) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origine ou destination manquante' });
        }

        try {
            const route = await mapService.calculateRoute(origin, destination);
            res.status(200).json(route);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'La fonctionnalité de calcul d\'itinéraire n\'est pas implémentée pour OpenStreetMap.') {
                    return res.status(501).json({ message: error.message });
                }
            }
            throw error;
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erreur lors du calcul de l\'itinéraire', error: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors du calcul de l\'itinéraire', error: 'Erreur inconnue' });
        }
    }
};

export const checkDeliveryZone = async (req: Request, res: Response) => {
    try {
        const { position, zoneId } = req.body;

        if (!position || !zoneId) {
            return res.status(400).json({ message: 'Position ou ID de zone manquant' });
        }

        const isInZone = await mapService.isPositionInDeliveryZone(position, zoneId);
        res.status(200).json({ isInZone });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erreur lors de la vérification de la zone de livraison', error: error.message });
        } else {
            res.status(500).json({ message: 'Erreur lors de la vérification de la zone de livraison', error: 'Erreur inconnue' });
        }
    }
};
