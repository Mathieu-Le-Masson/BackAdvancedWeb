import {Op} from 'sequelize';
import Restaurant from '../models/Restaurant';
import RestaurantAddress from '../models/RestaurantAdress';
import RestaurantDocument from '../models/RestaurantDocument';
import sequelize from "../config/database";

export default class RestaurantService {
    // Méthode pour créer un restaurant avec son adresse
    async createRestaurant(restaurantData: any) {
        // Démarrer une transaction pour garantir la cohérence des données
        const transaction = await sequelize.transaction();

        try {
            let addressId = null;

            // Si une adresse est fournie, la créer d'abord
            if (restaurantData.address) {
                const newAddress = await RestaurantAddress.create({
                    streetNumber: restaurantData.address.streetNumber,
                    street: restaurantData.address.street,
                    complement: restaurantData.address.complement || null,
                    postalCode: restaurantData.address.postalCode,
                    city: restaurantData.address.city,
                    country: restaurantData.address.country
                }, { transaction });

                addressId = newAddress.id;
            }

            // Créer le restaurant avec la référence à l'adresse
            const restaurant = await Restaurant.create({
                name: restaurantData.name,
                phone: restaurantData.phone,
                email: restaurantData.email,
                description: restaurantData.description,
                cuisine: restaurantData.cuisine,
                priceRange: restaurantData.priceRange,
                capacity: restaurantData.capacity,
                openingHours: restaurantData.openingHours,
                ownerId: restaurantData.ownerId,
                address: addressId,
                addressString: restaurantData.addressString,
                isActive: restaurantData.isActive ?? true,
                documentIds: []
            }, { transaction });

            await transaction.commit();
            return restaurant;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Erreur lors de la création du restaurant: ${error}`);
        }
    }

    async getRestaurantById(id: string) {
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }
        try {
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
                include: [{ model: RestaurantAddress, as: 'addressDetails' }],
                order: [['name', 'ASC']]
            });

            console.log(`${restaurants.length} restaurants trouvés`);

            return restaurants;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des restaurants: ${error}`);
        }
    }

    async updateRestaurant(id: string, restaurantData: any) {
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }
        try {
            await restaurant.update(restaurantData);
            return restaurant;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du restaurant: ${error}`);
        }
    }

    async deleteRestaurant(id: string) {
        const restaurant = await Restaurant.findByPk(id);

        if (!restaurant) {
            throw new Error('Restaurant non trouvé');
        }

        try {
            await restaurant.destroy();
            return { success: true, message: 'Restaurant supprimé avec succès' };
        } catch (error) {
            console.error(`Erreur lors de la suppression du restaurant:`, error);
            throw error; // Relance l'erreur d'origine
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
        const document = await RestaurantDocument.findById(documentId);
        if (!document) {
            throw new Error('Document non trouvé');
        }
        try {
            return document;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du document: ${error}`);
        }
    }

    async deleteDocumentById(documentId: string) {
        const document = await RestaurantDocument.findById(documentId);
        if (!document) {
            throw new Error('Document non trouvé');
        }
        try {
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