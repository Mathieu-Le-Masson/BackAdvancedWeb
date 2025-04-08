import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class RestaurantAddress extends Model {
    public id!: string;
    public streetNumber!: string | null;
    public complement?: string | null;
    public street!: string | null;
    public postalCode!: string | null;
    public city!: string | null;
    public country!: string | null;
}

RestaurantAddress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    streetNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    complement: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'restaurant_addresses',
    modelName: 'RestaurantAddress'
});

export default RestaurantAddress;