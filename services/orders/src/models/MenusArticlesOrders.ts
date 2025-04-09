import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class MenusArticlesOrders extends Model {
  public id!: number;
  public orderId!: number;
  public articleId!: number | null; // Peut être null si pas d'article commandé
  public menuId!: number | null; // Peut être null si pas de menu commandé
  public quantity!: number;
}

MenusArticlesOrders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null si pas d'article commandé
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Null si pas de menu commandé
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'MenusArticlesOrders',
    tableName: 'menus_articles_orders', // Nom de la table dans la base de données
    timestamps: false, // Désactive les colonnes createdAt et updatedAt
  }
);

export default MenusArticlesOrders;
