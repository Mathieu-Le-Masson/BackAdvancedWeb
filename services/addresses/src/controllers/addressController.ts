import { Request, Response } from 'express';
import * as addressService from '../services/addressService';

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const addresses = await addressService.getAllAddresses();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const getAddressById = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await addressService.getAddressById(req.params.id);

        if (!address) {
            res.status(404).json({ message: 'Adresse non trouvée' });
            return;
        }

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await addressService.createNewAddress(req.body);

        res.status(201).json({
            message: 'Adresse créée avec succès',
            address
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await addressService.updateAddressData(req.params.id, req.body);

        if (!address) {
            res.status(404).json({ message: 'Adresse non trouvée' });
            return;
        }

        res.status(200).json({
            message: 'Adresse mise à jour avec succès',
            address
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await addressService.removeAddress(req.params.id);

        if (!deleted) {
            res.status(404).json({ message: 'Adresse non trouvée' });
            return;
        }

        res.status(200).json({ message: 'Adresse supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};