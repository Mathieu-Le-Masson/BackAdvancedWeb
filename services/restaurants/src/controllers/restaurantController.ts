import { RequestHandler } from 'express';
import RestaurantService from '../services/restaurantService';

const restaurantService = new RestaurantService();

export default class RestaurantController {
    createRestaurant: RequestHandler = async (req, res) => {
        try {
            const restaurantData = req.body;
            const restaurant = await restaurantService.createRestaurant(restaurantData);
            res.status(201).json(restaurant);
        } catch (error: any) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            res.status(statusCode).json({
                message: error.message || 'Une erreur est survenue lors de la création du restaurant'});
        }
    };

    getRestaurantById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const restaurant = await restaurantService.getRestaurantById(id);
            res.status(200).json(restaurant);
        } catch (error: any) {
            const statusCode = error.message === 'Restaurant non trouvé' ? 404 : 500;
            res.status(statusCode).json({
                message: error.message || 'Une erreur est survenue lors de la récupération du restaurant'});
        }
    };

    getAllRestaurants: RequestHandler = async (req, res) => {
        try {
            const filters: any = {};

            // N'ajouter isActive au filtre que si le paramètre est explicitement fourni
            if (req.query.isActive !== undefined) {
                filters.isActive = req.query.isActive === 'true';
            }

            if (req.query.ownerId) {
                filters.ownerId = req.query.ownerId as string;
            }

            if (req.query.name) {
                filters.name = req.query.name as string;
            }

            const restaurants = await restaurantService.getAllRestaurants(filters);
            res.status(200).json(restaurants);
        } catch (error: any) {
            res.status(500).json({
                message: error.message || 'Une erreur est survenue lors de la récupération des restaurants'});
        }
    };

    updateRestaurant: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const restaurantData = req.body;
            const restaurant = await restaurantService.updateRestaurant(id, restaurantData);
            res.status(200).json(restaurant);
        } catch (error: any) {
            const statusCode = error.message === 'Restaurant non trouvé' ? 404 : 500;
            res.status(statusCode).json({
                message: error.message || 'Une erreur est survenue lors de la mise à jour du restaurant'});
        }
    };

    deleteRestaurant: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await restaurantService.deleteRestaurant(id);
            res.status(200).json(result);
        } catch (error: any) {
            const statusCode = error.message === 'Restaurant non trouvé' ? 404 : 500;
            res.status(statusCode).json({
                message: error.message || 'Une erreur est survenue lors de la suppression du restaurant'});
        }
    };
}