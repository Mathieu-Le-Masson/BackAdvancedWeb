import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class RestaurantAddress extends Model {
    public id!: string;
    public streetNumber!: string;
    public complement?: string;
    public street!: string;
    public postalCode!: string;
    public city!: string;
    public country!: string;
}

RestaurantAddress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    streetNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complement: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'restaurant_addresses',
    modelName: 'RestaurantAddress'
});

export default RestaurantAddress;