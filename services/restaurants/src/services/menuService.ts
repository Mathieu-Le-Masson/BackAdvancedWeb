import Menu from '../models/Menu';
import MenuImage from '../models/MenuImage';
import Article from '../models/Article';

export default class MenuService {
    async findAll() {
        try {
            return await Menu.findAll({
                include: [{model: Article, as: 'articles'}]
            });
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number | string) {
        const menu = await Menu.findByPk(id, {
            include: [{model: Article, as: 'articles'}]
        });

        if (!menu) {
            throw new Error('Menu non trouvé');
        }
        try {
            return menu;
        } catch (error) {
            throw error;
        }
    }

    async findByRestaurantId(restaurantId: string) {
        try {
            return await Menu.findAll({
                where: {restaurantId: restaurantId}
            });
        } catch (error) {
            console.error('Erreur lors de la recherche des menus par restaurant:', error);
            throw error;
        }
    }

    async create(menuData: any) {
        try {
            return await Menu.create(menuData);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number | string, menuData: any) {
        const menu = await Menu.findByPk(id);

        if (!menu) {
            throw new Error('Menu non trouvé');
        }
        try {
            return await menu.update(menuData);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number | string) {
        const menu = await Menu.findByPk(id);

        if (!menu) {
            throw new Error('Menu non trouvé');
        }
        try {
            await menu.destroy();
        } catch (error) {
            throw error;
        }
    }

    async saveMenuImage(menuId: number, imageData: any) {
        const menu = await Menu.findByPk(menuId);
        if (!menu) {
            throw new Error('Menu non trouvé');
        }

        const image = new MenuImage({
            menuId,
            name: imageData.name,
            data: imageData.buffer,
            contentType: imageData.mimetype
        });

        const savedImage = await image.save();

        // Mettre à jour le menu avec l'URL de l'image
        await menu.update({
            imageUrl: `/api/menus/${menuId}/images/${savedImage._id}`
        });

        return savedImage;
    }

    // Récupérer une image par ID
    async getImageById(imageId: string) {
        const image = await MenuImage.findById(imageId);
        if (!image) {
            throw new Error('Image non trouvée');
        }
        return image;
    }

    // Supprimer une image
    async deleteImage(imageId: string) {
        const image = await MenuImage.findById(imageId);
        if (!image) {
            throw new Error('Image non trouvée');
        }

        // Mettre à jour le menu associé
        const menu = await Menu.findByPk(image.menuId);
        if (menu && menu.imageUrl && menu.imageUrl.includes(imageId)) {
            await menu.update({ imageUrl: null });
        }

        return await MenuImage.findByIdAndDelete(imageId);
    }
}