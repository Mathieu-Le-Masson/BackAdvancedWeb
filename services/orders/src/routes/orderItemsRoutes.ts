import express from 'express';
import { getArticlesAndMenus, getArticlesByRestaurant, getMenusByRestaurant, getOrderId } from '../controllers/orderItemsController';

const router = express.Router();

router.get('/orderItems', getArticlesAndMenus);
router.get('/menus/:menuId/articles', getArticlesByRestaurant);
router.get('/restaurants/:restaurantId/menus', getMenusByRestaurant);
router.get('/orders/:orderId', getOrderId);

export default router;