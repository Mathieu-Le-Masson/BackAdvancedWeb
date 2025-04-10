import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
    public id!: number;
    public clientId!: string;
    public restaurantId!: string;
    public price!: number | null;
    public distance!: number | null;
    public duration!: number | null;
    public delivererId!: string | null;
    public deliveryId!: string | null;
    public status!: 'panier' | 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
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
        type: DataTypes.ENUM('Panier','En attente', 'En cours de préparation', 'Prête', 'En livraison', 'Livrée', 'Annulée'),
        allowNull: false,
        defaultValue: 'Panier'
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
    modelName: 'Order',
    tableName: 'orders',
});

export default Order;