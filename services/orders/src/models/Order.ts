import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
    public id!: number;
    public orderNumber!: number;
    public clientId!: string;
    public restaurantId!: string;
    public price!: number | null;
    public distance!: number | null;
    public duration!: number | null;
    public delivererId!: string | null;
    public deliveryId!: string | null;
    public status!: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
    public totalAmount!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date | null;
    public destination!: string | null;
    public origin!: string |null ;
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
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
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
        allowNull: true
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: true
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