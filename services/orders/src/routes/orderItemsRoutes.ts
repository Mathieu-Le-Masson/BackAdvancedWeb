import { Router } from 'express';
import {
  createOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
} from '../controllers/orderItemsController';

const router = Router();

router.post('/', createOrderItem);
router.get('/', getOrderItems);
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

export default router;
