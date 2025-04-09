// src/routes/orderRoutes.ts
import { Router } from 'express';
import OrderController from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
console.log('ici1');
router.post('/', orderController.createOrder);
console.log('ici16');
router.put('/:id', orderController.updateOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/delivery', orderController.updateDeliveryInfo);
router.delete('/:id', orderController.deleteOrder);

export default router;