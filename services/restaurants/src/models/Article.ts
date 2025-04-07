// src/models/Article.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Restaurant from './Restaurant';
import Menu from './Menu';

class Article extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public restaurantId!: string;
    public menuId!: string | null;
    public imageUrl!: string | null;
}

Article.init({
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
    restaurantId: {
        type: DataTypes.UUID,
        references: {
            model: Restaurant,
            key: 'id'
        }
    },
    menuId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Menu,
            key: 'id'
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'articles'
});

// Associations
Article.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Restaurant.hasMany(Article, { foreignKey: 'restaurantId', as: 'articles' });

Article.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });
Menu.hasMany(Article, { foreignKey: 'menuId', as: 'articles' });

export default Article;