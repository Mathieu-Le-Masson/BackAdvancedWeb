import MenusArticlesOrders from '../models/MenusArticlesOrders';

const createOrderItem = async (data: any) => {
  return await MenusArticlesOrders.create(data);
};

const getOrderItems = async () => {
  return await MenusArticlesOrders.findAll();
};

const updateOrderItem = async (id: number, data: any) => {
  const orderItem = await MenusArticlesOrders.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }
  return await orderItem.update(data);
};

const deleteOrderItem = async (id: number) => {
  const orderItem = await MenusArticlesOrders.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }
  await orderItem.destroy();
};

export default {
  createOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
};
