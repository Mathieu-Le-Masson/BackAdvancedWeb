import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class DeliveryZone extends Model {
    public id!: string;
    public name!: string;
    public coordinates!: { lat: number; lng: number }[];
}

DeliveryZone.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'delivery_zones',
    modelName: 'DeliveryZone',
});

export default DeliveryZone;