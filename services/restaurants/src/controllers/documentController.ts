import { Request, Response } from 'express';
import RestaurantService from '../services/restaurantService';

export default class DocumentController {
    private restaurantService: RestaurantService;

    constructor() {
        this.restaurantService = new RestaurantService();
    }

    uploadDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const restaurantId = req.params.id;

            // Vérifier si nous avons un fichier via multer ou des données base64 dans le body
            let documentData;

            if (req.file) {
                // Cas d'un fichier envoyé via multipart/form-data
                documentData = {
                    name: req.file.originalname,
                    buffer: req.file.buffer,
                    mimetype: req.file.mimetype
                };
            } else if (req.body && req.body.file) {
                // Cas des données en base64
                const dataUrlRegex = /^data:([A-Za-z-+/]+);base64,(.+)$/;
                const matches = req.body.file.match(dataUrlRegex);

                if (!matches || matches.length !== 3) {
                    res.status(400).json({ message: 'Format de données invalide' });
                    return;
                }

                const mimetype = matches[1];
                const buffer = Buffer.from(matches[2], 'base64');

                documentData = {
                    name: req.body.name || 'document',
                    buffer: buffer,
                    mimetype: mimetype
                };
            } else {
                res.status(400).json({ message: 'Aucun document fourni' });
                return;
            }

            const result = await this.restaurantService.saveRestaurantDocument(
                restaurantId,
                documentData
            );

            res.status(201).json({
                id: result._id,
                name: result.name,
                contentType: result.contentType,
                url: `/api/restaurants/${restaurantId}/documents/${result._id}`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de l'upload du document", error: errorMessage });
        }
    };

    getRestaurantDocuments = async (req: Request, res: Response): Promise<void> => {
        try {
            const restaurantId = req.params.id;
            const documents = await this.restaurantService.getDocumentsByRestaurantId(restaurantId);

            const documentList = documents.map(doc => ({
                id: doc._id,
                name: doc.name,
                contentType: doc.contentType,
                url: `/api/restaurants/${restaurantId}/documents/${doc._id}`
            }));

            res.json(documentList);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de la récupération des documents", error: errorMessage });
        }
    };

    getDocumentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const documentId = req.params.documentId;
            const document = await this.restaurantService.getDocumentById(documentId);

            if (!document) {
                res.status(404).json({ message: "Document non trouvé" });
                return;
            }

            res.contentType(document.contentType);
            res.send(document.data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de la récupération du document", error: errorMessage });
        }
    };

    deleteDocumentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const documentId = req.params.documentId;
            const result = await this.restaurantService.deleteDocumentById(documentId);

            if (!result) {
                res.status(404).json({ message: "Document non trouvé" });
                return;
            }

            res.status(200).json({ message: "Document supprimé avec succès" });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            res.status(500).json({ message: "Erreur lors de la suppression du document", error: errorMessage });
        }
    };


}