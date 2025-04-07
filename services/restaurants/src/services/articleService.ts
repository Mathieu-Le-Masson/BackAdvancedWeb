import Article from '../models/Article';

export default class ArticleService {
    async findAll() {
        try {
            return await Article.findAll();
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number | string) {
        try {
            const article = await Article.findByPk(id);

            if (!article) {
                throw new Error('Article non trouvé');
            }

            return article;
        } catch (error) {
            throw error;
        }
    }

    async create(articleData: any) {
        try {
            return await Article.create(articleData);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number | string, articleData: any) {
        try {
            const article = await Article.findByPk(id);

            if (!article) {
                throw new Error('Article non trouvé');
            }

            return await article.update(articleData);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number | string) {
        try {
            const article = await Article.findByPk(id);

            if (!article) {
                throw new Error('Article non trouvé');
            }

            await article.destroy();
        } catch (error) {
            throw error;
        }
    }
}