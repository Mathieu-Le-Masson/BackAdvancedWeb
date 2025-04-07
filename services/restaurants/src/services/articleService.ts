import Article from '../models/Article';
import ArticleImage from '../models/ArticleImage';

export default class ArticleService {
    async findAll() {
        try {
            return await Article.findAll();
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number | string) {
        const article = await Article.findByPk(id);

        if (!article) {
            throw new Error('Article non trouvé');
        }
        try {
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
        const article = await Article.findByPk(id);

        if (!article) {
            throw new Error('Article non trouvé');
        }
        try {
            return await article.update(articleData);
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number | string) {
        const article = await Article.findByPk(id);

        if (!article) {
            throw new Error('Article non trouvé');
        }
        try {
            await article.destroy();
        } catch (error) {
            throw error;
        }
    }

    async saveArticleImage(articleId: number, imageData: any) {
        const article = await Article.findByPk(articleId);
        if (!article) {
            throw new Error('Article non trouvé');
        }

        const image = new ArticleImage({
            articleId,
            name: imageData.name,
            data: imageData.buffer,
            contentType: imageData.mimetype
        });

        const savedImage = await image.save();

        // Mettre à jour l'article avec l'URL de l'image
        await article.update({
            imageUrl: `/api/articles/${articleId}/images/${savedImage._id}`
        });

        return savedImage;
    }

    async getImageById(imageId: string) {
        const image = await ArticleImage.findById(imageId);
        if (!image) {
            throw new Error('Image non trouvée');
        }
        return image;
    }

    async deleteImage(imageId: string) {
        const image = await ArticleImage.findById(imageId);
        if (!image) {
            throw new Error('Image non trouvée');
        }

        // Mettre à jour l'article associé
        const article = await Article.findByPk(image.articleId);
        if (article && article.imageUrl && article.imageUrl.includes(imageId)) {
            await article.update({ imageUrl: null });
        }

        return await ArticleImage.findByIdAndDelete(imageId);
    }
}