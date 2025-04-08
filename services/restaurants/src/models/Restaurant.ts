import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import RestaurantAddress from './RestaurantAdress';

class Restaurant extends Model {
    public id!: string;
    public name!: string;
    public address!: string | null; // C'est l'UUID, pas l'objet RestaurantAddress
    public addressString!: string | null;
    public phone!: string;
    public email!: string;
    public description!: string;
    public cuisine!: string;
    public priceRange!: string;
    public capacity!: number;
    public openingHours!: object;
    public ownerId!: string | null;
    public isActive!: boolean;
    public documentId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Propriété virtuelle pour l'association
    public addressDetails?: RestaurantAddress | null;
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
    address: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: RestaurantAddress,
            key: 'id'
        }
    },
    addressString: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
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
    documentId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'restaurants',
    timestamps: true,
});

// Associations
Restaurant.belongsTo(RestaurantAddress, {foreignKey: 'address', as: 'addressDetails'});

export default Restaurant;