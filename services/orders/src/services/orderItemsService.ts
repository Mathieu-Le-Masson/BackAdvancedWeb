import OrderItemsModels from '../models/orderItemsModels';

const createOrderItem = async (data: any) => {
  return await OrderItemsModels.create(data);
};

const getOrderItemsById = async (id: number) => {
  return await OrderItemsModels.findByPk(id);
};

const getOrderItemsByOrderId = async (orderId: number) => {
  return await OrderItemsModels.findAll({ where: { orderId } });
};

const updateOrderItem = async (id: number, data: any) => {
  const orderItem = await OrderItemsModels.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }
  return await orderItem.update(data);
};

const deleteOrderItem = async (id: number) => {
  const orderItem = await OrderItemsModels.findByPk(id);
  if (!orderItem) {
    throw new Error('Order item not found');
  }
  await orderItem.destroy();
};

export default {
  createOrderItem,
  getOrderItemsById,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
};

