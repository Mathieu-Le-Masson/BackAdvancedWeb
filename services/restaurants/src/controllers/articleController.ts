import { Request, Response } from 'express';
import ArticleService from '../services/articleService';

export default class ArticleController {
    private articleService: ArticleService;

    constructor() {
        this.articleService = new ArticleService();
    }

    getAllArticles = async (req: Request, res: Response): Promise<void> => {
        try {
            const articles = await this.articleService.findAll();
            res.status(200).json(articles);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    getArticleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const article = await this.articleService.findById(req.params.id);
            res.status(200).json(article);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'article:', error);
            if ((error as Error).message === 'Article non trouvé') {
                res.status(404).json({ message: 'Article non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };

    getArticlesByRestaurantId = async (req: Request, res: Response): Promise<void> => {
        try {
            const restaurantId = req.params.restaurantId;
            const articles = await this.articleService.findByRestaurantId(restaurantId);
            res.status(200).json(articles);
        } catch (error) {
            console.error('Erreur lors de la récupération des articles par restaurant:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    createArticle = async (req: Request, res: Response): Promise<void> => {
        try {
            const newArticle = await this.articleService.create(req.body);
            res.status(201).json(newArticle);
        } catch (error) {
            console.error('Erreur lors de la création de l\'article:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    updateArticle = async (req: Request, res: Response): Promise<void> => {
        try {
            const article = await this.articleService.update(req.params.id, req.body);
            res.status(200).json(article);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            if ((error as Error).message === 'Article non trouvé') {
                res.status(404).json({ message: 'Article non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };

    deleteArticle = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.articleService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article:', error);
            if ((error as Error).message === 'Article non trouvé') {
                res.status(404).json({ message: 'Article non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };

    uploadArticleImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const articleId = parseInt(req.params.id);
            if (!req.file) {
                res.status(400).json({ message: 'Aucune image fournie' });
                return;
            }

            const result = await this.articleService.saveArticleImage(
                articleId,
                {
                    name: req.file.originalname,
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype
                }
            );

            res.status(201).json({
                id: result._id,
                name: result.name,
                contentType: result.contentType,
                url: `/api/articles/${articleId}/images/${result._id}`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de l'upload de l'image", error: errorMessage });
        }
    };

    getArticleImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const imageId = req.params.imageId;
            const image = await this.articleService.getImageById(imageId);

            res.contentType(image.contentType);
            res.send(image.data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de la récupération de l'image", error: errorMessage });
        }
    };

    deleteArticleImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const imageId = req.params.imageId;
            await this.articleService.deleteImage(imageId);
            res.status(200).json({ message: "Image supprimée avec succès" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de la suppression de l'image", error: errorMessage });
        }
    };
}