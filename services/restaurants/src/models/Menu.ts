// src/models/Menu.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Restaurant from './Restaurant';

class Menu extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public imageUrl!: string | null;
    public restaurantId!: string;
}

Menu.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    restaurantId: {
        type: DataTypes.UUID,
        references: {
            model: Restaurant,
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: 'menus'
});

// Association avec Restaurant
Menu.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Restaurant.hasMany(Menu, { foreignKey: 'restaurantId', as: 'menus' });

export default Menu;