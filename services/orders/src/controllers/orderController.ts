// src/controllers/orderController.ts
import { Request, Response } from 'express';
import OrderService from '../services/orderService';

export default class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    getOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters = req.query;
            const orders = await this.orderService.getOrders(filters);
            res.json(orders);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: errorMessage });
        }
    };

    getOrderById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const order = await this.orderService.getOrderById(id);

            if (!order) {
                res.status(404).json({ message: 'Commande non trouvée' });
                return;
            }

            res.json(order);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: errorMessage });
        }
    };

    getOrderByClientId = async (req: Request, res: Response): Promise<void> => {
        try {
            const clientId = req.params.clientId;
            const order = await this.orderService.getOrderByClientId(clientId);

            if (!order) {
                res.status(404).json({ message: 'Commande non trouvée' });
                return;
            }

            res.json(order);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: errorMessage });
        }
    }

    createOrder = async (req: Request, res: Response): Promise<void> => {
        console.log('ici222222222');

        try {
            console.log('ici2');
            const orderData = req.body;
            const order = await this.orderService.createOrder(orderData);
            console.log('ici12');
            res.status(201).json(order);
        } catch (error: unknown) {
            console.log('ici13');
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            console.log('ici14');
            res.status(500).json({ message: 'Erreur lors de la création de la commande', error: errorMessage });
            console.log('ici15');
        }
    };

    updateOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const orderData = req.body;
            const order = await this.orderService.updateOrder(id, orderData);
            res.json(order);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error: errorMessage });
        }
    };

    updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const { status } = req.body;

            if (!status) {
                res.status(400).json({ message: 'Le statut est requis' });
                return;
            }

            const order = await this.orderService.updateOrderStatus(id, status);
            res.json(order);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la commande', error: errorMessage });
        }
    };

    updateDeliveryInfo = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const { delivererId, price, distance, duration } = req.body;

            if (!delivererId && price === undefined && distance === undefined && duration === undefined) {
                res.status(400).json({ message: 'Au moins une information de livraison est requise' });
                return;
            }

            const order = await this.orderService.updateDeliveryInfo(id, { delivererId, price, distance, duration });
            res.json(order);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la mise à jour des informations de livraison', error: errorMessage });
        }
    };

    deleteOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await this.orderService.deleteOrder(id);

            if (result === 0) {
                res.status(404).json({ message: 'Commande non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Commande supprimée avec succès' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: 'Erreur lors de la suppression de la commande', error: errorMessage });
        }
    };
}