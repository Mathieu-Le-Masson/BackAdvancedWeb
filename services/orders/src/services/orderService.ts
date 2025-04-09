import Order from '../models/Order';

export default class OrderService {
    async getOrders(filters: any = {}) {
        return await Order.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
    }

    async getOrderById(id: number) {
        console.log('ici9');
        return await Order.findByPk(id);
    }

    async createOrder(orderData: any) {
        try {
            console.log('ici3');
            // Appel à l'API pour récupérer les données de route
            const response = await fetch('http://localhost:8080/api/maps/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: orderData.origin,
                    destination: orderData.destination,
                }),
            });
            console.log('ici4');
            if (!response.ok) {
                throw new Error('Erreur lors du calcul de l\'itinéraire. Vérifiez votre adresse.');
            }
            console.log('ici5');
            const routeData = await response.json();
            console.log('ici6');
            // Ajout des données de route à orderData
            orderData.distance = routeData.distance;
            orderData.duration = routeData.duration;
            orderData.deliveryPrice = 2.85 + (routeData.distance * 0.82);  // Prix de base + prix par km
            orderData.totalAmount = orderData.totalAmount + orderData.deliveryPrice; // Prix total = prix de la commande + prix de livraison
            console.log('ici7');
            // Crée la commande
            const order = await Order.create(orderData);
            console.log('ici8');
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