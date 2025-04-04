import { Op } from 'sequelize';
import Restaurant from '../models/Restaurant';
import RestaurantAddress from '../models/RestaurantAdress';

export default class RestaurantService {
    async createRestaurant(restaurantData: any) {
        try {
            const restaurant = await Restaurant.create(restaurantData);
            return restaurant;
        } catch (error) {
            throw new Error(`Erreur lors de la création du restaurant: ${error}`);
        }
    }

    async getRestaurantById(id: string) {
        try {
            const restaurant = await Restaurant.findByPk(id, {
                include: [{ model: RestaurantAddress, as: 'address' }]
            });
            if (!restaurant) {
                throw new Error('Restaurant non trouvé');
            }
            return restaurant;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du restaurant: ${error}`);
        }
    }

    async getAllRestaurants(filters: any = {}) {
        try {
            console.log('Filtres appliqués:', filters);

            const whereClause: any = {};

            if (filters.isActive !== undefined) {
                whereClause.isActive = filters.isActive;
            }

            if (filters.ownerId) {
                whereClause.ownerId = filters.ownerId;
            }

            if (filters.name) {
                whereClause.name = { [Op.iLike]: `%${filters.name}%` };
            }

            console.log('Where clause:', JSON.stringify(whereClause));

            const restaurants = await Restaurant.findAll({
                where: whereClause,
                include: [{ model: RestaurantAddress, as: 'address' }],
                order: [['name', 'ASC']]
            });

            console.log(`${restaurants.length} restaurants trouvés`);

            return restaurants;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des restaurants: ${error}`);
        }
    }

    async updateRestaurant(id: string, restaurantData: any) {
        try {
            const restaurant = await Restaurant.findByPk(id);
            if (!restaurant) {
                throw new Error('Restaurant non trouvé');
            }

            await restaurant.update(restaurantData);
            return restaurant;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du restaurant: ${error}`);
        }
    }

    async deleteRestaurant(id: string) {
        try {
            const restaurant = await Restaurant.findByPk(id);
            if (!restaurant) {
                throw new Error('Restaurant non trouvé');
            }

            await restaurant.destroy();
            return { success: true, message: 'Restaurant supprimé avec succès' };
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du restaurant: ${error}`);
        }
    }
}