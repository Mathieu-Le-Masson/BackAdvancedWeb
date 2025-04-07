import Menu from '../models/Menu';
import Article from '../models/Article';

export default class MenuService {
    async findAll() {
        try {
            return await Menu.findAll({
                include: [{ model: Article, as: 'articles' }]
            });
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number | string) {
        try {
            const menu = await Menu.findByPk(id, {
                include: [{ model: Article, as: 'articles' }]
            });

            if (!menu) {
                throw new Error('Menu non trouvé');
            }

            return menu;
        } catch (error) {
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
        try {
            const menu = await Menu.findByPk(id);

            if (!menu) {
                throw new Error('Menu non trouvé');
            }

            return await menu.update(menuData);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number | string) {
        try {
            const menu = await Menu.findByPk(id);

            if (!menu) {
                throw new Error('Menu non trouvé');
            }

            await menu.destroy();
        } catch (error) {
            throw error;
        }
    }
}