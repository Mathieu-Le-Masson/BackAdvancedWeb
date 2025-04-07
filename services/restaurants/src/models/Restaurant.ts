import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import RestaurantAddress from './RestaurantAdress';

class Restaurant extends Model {
    public id!: string;
    public name!: string;
    public addressId!: string | null;
    public phone!: string;
    public email!: string;
    public description!: string;
    public cuisine!: string;
    public priceRange!: string;
    public capacity!: number;
    public openingHours!: object;
    public ownerId!: string | null;
    public isActive!: boolean;
    public documentIds!: string[];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Restaurant.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: RestaurantAddress,
            key: 'id'
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cuisine: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priceRange: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    openingHours: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    documentIds: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
}, {
    sequelize,
    tableName: 'restaurants',
    timestamps: true,
});

// Associations
Restaurant.belongsTo(RestaurantAddress, {foreignKey: 'addressId', as: 'address'});

export default Restaurant;