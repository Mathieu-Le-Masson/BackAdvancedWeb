import Order from '../models/Order';

export default class OrderService {
    async getOrders(filters: any = {}) {
        return await Order.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
    }

    async getOrderById(id: number) {
        return await Order.findByPk(id);
    }

    async createOrder(orderData: any) {
        try {
            // Crée la commande
            const order = await Order.create(orderData);

            // Retourne la commande créée
            return await this.getOrderById(order.id);
        } catch (error) {
            throw error;
        }
    }

    async updateOrder(id: number, orderData: any) {
        const order = await Order.findByPk(id);

        if (!order) {
            throw new Error('Commande non trouvée');
        }
        try {
            // Mise à jour des détails de la commande
            await order.update(orderData);

            // Retourne la commande mise à jour
            return await this.getOrderById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateOrderStatus(id: number, status: string) {
        const order = await Order.findByPk(id);

        if (!order) {
            throw new Error('Commande non trouvée');
        }

        return await order.update({ status });
    }

    async updateDeliveryInfo(id: number, deliveryInfo: { delivererId?: string, price?: number, distance?: number, duration?: number }) {
        const order = await Order.findByPk(id);

        if (!order) {
            throw new Error('Commande non trouvée');
        }

        return await order.update(deliveryInfo);
    }

    async deleteOrder(id: number) {
        try {
            return await Order.destroy({
                where: {id}
            });
        } catch (error) {
            throw error;
        }
    }
}