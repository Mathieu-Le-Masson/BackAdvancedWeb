import { Request, Response } from 'express';
import Address from '../models/Address';

export const getAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const addresses = await Address.findAll();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAddressById = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await Address.findByPk(req.params.id);

        if (!address) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { streetNumber, complement, street, postalCode, city, country } = req.body;

        const address = await Address.create({
            streetNumber,
            complement,
            street,
            postalCode,
            city,
            country
        });

        res.status(201).json({
            message: 'Address created successfully',
            address
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await Address.findByPk(req.params.id);

        if (!address) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }

        await address.update(req.body);

        res.status(200).json({
            message: 'Address updated successfully',
            address
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const address = await Address.findByPk(req.params.id);

        if (!address) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }

        await address.destroy();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};