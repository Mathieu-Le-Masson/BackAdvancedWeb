import { Request, Response } from 'express';
import orderItemsService from '../services/orderItemsService';

export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const orderItem = await orderItemsService.createOrderItem(req.body);
    res.status(201).json(orderItem);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    res.status(500).json({ error: errorMessage });
  }
};

export const getOrderItemsByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const orderItems = await orderItemsService.getOrderItemsByOrderId(Number(orderId));
    if (!orderItems || orderItems.length === 0) {
      return res.status(404).json({ error: 'No order items found for the given order ID' });
    }
    res.status(200).json(orderItems);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    res.status(500).json({ error: errorMessage });
  }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrderItem = await orderItemsService.updateOrderItem(Number(id), req.body);
    res.status(200).json(updatedOrderItem);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    res.status(500).json({ error: errorMessage });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await orderItemsService.deleteOrderItem(Number(id));
    res.status(204).send();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
    res.status(500).json({ error: errorMessage });
  }
};

