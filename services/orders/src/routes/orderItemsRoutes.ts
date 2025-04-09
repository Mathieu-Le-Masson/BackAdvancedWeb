import { Router } from 'express';
import {
  createOrderItem,
  getOrderItemsByOrderId,
  deleteOrderItemsByOrderId,
} from '../controllers/orderItemsController';

const router = Router();

router.post('/', createOrderItem);
// @ts-ignore
router.get('/:orderId', getOrderItemsByOrderId); // Mise à jour pour récupérer par orderId
router.delete('/:orderId', deleteOrderItemsByOrderId); // Mise à jour pour supprimer par orderId

export default router;

