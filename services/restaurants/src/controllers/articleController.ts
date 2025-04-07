// src/controllers/articleController.ts
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
}