import {Op} from 'sequelize';
import Restaurant from '../models/Restaurant';
import RestaurantAddress from '../models/RestaurantAdress';
import RestaurantDocument from '../models/RestaurantDocument';

export default class RestaurantService {
    async createRestaurant(restaurantData: any) {
        try {
            return await Restaurant.create(restaurantData);
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

    // Méthode pour stocker un document associé à un restaurant
    async saveRestaurantDocument(restaurantId: string, documentData: any) {
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }

        const document = new RestaurantDocument({
            restaurantId,
            name: documentData.name,
            data: documentData.buffer,
            contentType: documentData.mimetype
        });

        const savedDoc = await document.save();

        // Mettre à jour le restaurant avec l'ID du document
        await restaurant.update({
            documentIds: [...(restaurant.documentIds || []), savedDoc._id.toString()]
        });

        return savedDoc;
    }

    // Récupérer tous les documents d'un restaurant
    async getDocumentsByRestaurantId(restaurantId: string) {
        try {
            return await RestaurantDocument.find({restaurantId});
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des documents: ${error}`);
        }
    }

    // Récupérer un document spécifique
    async getDocumentById(documentId: string) {
        try {
            const document = await RestaurantDocument.findById(documentId);
            if (!document) {
                throw new Error('Document non trouvé');
            }
            return document;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du document: ${error}`);
        }
    }

    async deleteDocumentById(documentId: string) {
        try {
            const document = await RestaurantDocument.findById(documentId);
            if (!document) {
                throw new Error('Document non trouvé');
            }

            // Trouver et mettre à jour le restaurant associé
            const restaurant = await Restaurant.findOne({
                where: {
                    documentIds: {
                        [Op.contains]: [documentId]
                    }
                }
            });

            if (restaurant) {
                const updatedDocumentIds = restaurant.documentIds.filter(id => id !== documentId);
                await restaurant.update({ documentIds: updatedDocumentIds });
            }

            // Supprimer le document
            await RestaurantDocument.findByIdAndDelete(documentId);

            return { success: true };
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du document: ${error}`);
        }
    }
}