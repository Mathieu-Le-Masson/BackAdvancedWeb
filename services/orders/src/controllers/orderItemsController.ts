import { Request, Response } from 'express';
import OrderItemsService from '../services/orderItemsService';

const orderItems = new OrderItemsService();

export const getArticlesAndMenus = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await orderItems.getArticlesAndMenus();
        res.status(200).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération des données combinées', error: errorMessage });
    }
};

export const getArticlesByRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuId = req.params.menuId;
        const articles = await orderItems.getArticlesByRestaurant(menuId);
        res.status(200).json(articles);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération des articles pour le menu', error: errorMessage });
    }
};

export const getMenusByRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurantId = req.params.restaurantId;
        const menus = await orderItems.getMenusByRestaurant(restaurantId);
        res.status(200).json(menus);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération des menus pour le restaurant', error: errorMessage });
    }
};

export const getOrderId = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId;
        const order = await orderItems.getOrderId(orderId);
        res.status(200).json(order);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error: errorMessage });
    }
}