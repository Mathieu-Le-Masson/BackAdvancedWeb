// src/controllers/menuController.ts
import { Request, Response } from 'express';
import MenuService from '../services/menuService';

export default class MenuController {
    private menuService: MenuService;

    constructor() {
        this.menuService = new MenuService();
    }

    getAllMenus = async (req: Request, res: Response): Promise<void> => {
        try {
            const menus = await this.menuService.findAll();
            res.status(200).json(menus);
        } catch (error) {
            console.error('Erreur lors de la récupération des menus:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    getMenuById = async (req: Request, res: Response): Promise<void> => {
        try {
            const menu = await this.menuService.findById(req.params.id);
            res.status(200).json(menu);
        } catch (error) {
            console.error('Erreur lors de la récupération du menu:', error);
            if ((error as Error).message === 'Menu non trouvé') {
                res.status(404).json({ message: 'Menu non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };

    createMenu = async (req: Request, res: Response): Promise<void> => {
        try {
            const newMenu = await this.menuService.create(req.body);
            res.status(201).json(newMenu);
        } catch (error) {
            console.error('Erreur lors de la création du menu:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    };

    updateMenu = async (req: Request, res: Response): Promise<void> => {
        try {
            const menu = await this.menuService.update(req.params.id, req.body);
            res.status(200).json(menu);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du menu:', error);
            if ((error as Error).message === 'Menu non trouvé') {
                res.status(404).json({ message: 'Menu non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };

    deleteMenu = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.menuService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            console.error('Erreur lors de la suppression du menu:', error);
            if ((error as Error).message === 'Menu non trouvé') {
                res.status(404).json({ message: 'Menu non trouvé' });
            } else {
                res.status(500).json({ message: 'Erreur serveur' });
            }
        }
    };
}