import OrderItemsModels from '../models/orderItemsModels';

const createOrderItem = async (data: any) => {
  return await OrderItemsModels.create(data);
};

const getOrderItemsByOrderId = async (orderId: number) => {
  return await OrderItemsModels.findAll({ where: { orderId } });
};

const deleteOrderItemsByOrderId = async (orderId: number) => {
  const orderItems = await OrderItemsModels.findAll({ where: { orderId } });
  if (!orderItems || orderItems.length === 0) {
    throw new Error('No order items found for the given order ID');
  }
  await OrderItemsModels.destroy({ where: { orderId } });
};

const deleteOrderItemsById = async (orderItemId: number) => {
    const orderItem = await OrderItemsModels.findByPk(orderItemId);
    if (!orderItem) {
        throw new Error('No order item found for the given ID');
    }
    await OrderItemsModels.destroy({ where: { id: orderItemId } });
}

export default {
  createOrderItem,
  getOrderItemsByOrderId,
  deleteOrderItemsByOrderId,
  deleteOrderItemsById,
};
