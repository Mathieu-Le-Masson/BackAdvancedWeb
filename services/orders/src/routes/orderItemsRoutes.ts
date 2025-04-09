import { Router } from 'express';
import {
  createOrderItem,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
} from '../controllers/orderItemsController';

const router = Router();

router.post('/', createOrderItem);
// @ts-ignore
router.get('/:orderId', getOrderItemsByOrderId); // Mise à jour pour récupérer par orderId
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

export default router;
