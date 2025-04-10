import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class OrderItemsModels extends Model {
  public id!: number;
  public orderId!: number;
  public articleId!: string | null; // Peut être null si pas d'article commandé
  public menuId!: string | null; // Peut être null si pas de menu commandé
  public quantity!: number;
}

OrderItemsModels.init(
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
        type: DataTypes.UUID,
        allowNull: true, // Null si pas d'article commandé
    },
    menuId: {
        type: DataTypes.UUID,
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
    modelName: 'OrderItemsModels',
    tableName: 'menus_articles_orders', // Nom de la table dans la base de données
    timestamps: false, // Désactive les colonnes createdAt et updatedAt
  }
);

export default OrderItemsModels;
