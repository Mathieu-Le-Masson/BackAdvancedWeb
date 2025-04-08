// src/routes/orderRoutes.ts
import { Router } from 'express';
import OrderController from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', orderController.createOrder);
router.put('/orders/:id', orderController.updateOrder);
router.patch('/orders/:id/status', orderController.updateOrderStatus);
router.patch('/orders/:id/delivery', orderController.updateDeliveryInfo);
router.delete('/orders/:id', orderController.deleteOrder);

export default router;