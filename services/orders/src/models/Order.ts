import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
    public id!: number;
    public orderNumber!: number;
    public clientId!: string;
    public restaurantId!: string | null;
    public price!: number;
    public distance!: number | null;
    public duration!: number | null;
    public delivererId!: string | null;
    public deliveryId!: string | null;
    public status!: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
    public totalAmount!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date | null;
    public destination!: string;
    public origin!: string;
    public deliveryPrice!: number | null;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    restaurantId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    duration: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    delivererId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    deliveryId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('panier','pending', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
}, {
    sequelize,
    tableName: 'orders',
    hooks: {
        beforeCreate: async (order: Order) => {
            // Récupère le dernier numéro de commande et incrémente
            const lastOrder = await Order.findOne({
                order: [['orderNumber', 'DESC']]
            });

            order.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;
        }
    }
});

export default Order;