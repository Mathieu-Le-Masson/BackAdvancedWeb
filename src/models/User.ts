// src/models/User.ts
import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import Address from './Address';

class User extends Model {
    public id!: string;
    public name!: string;
    public firstName!: string;
    public email!: string;
    public phone!: string;
    public addressId!: string | null;
    public password!: string;
    public userType!: string;
    public referralCode!: string;
    public referredBy!: number | null;
    public isActive!: boolean;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    addressId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'addresses',
            key: 'id'
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userType: {
        type: DataTypes.ENUM('admin', 'client', 'restaurateur', 'livreur', 'developpeur', 'commercial', 'technique'),
        allowNull: false,
        defaultValue: 'client',
    },
    referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    referredBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});

// Self-referencing relationship for referrals
User.hasMany(User, {as: 'referrals', foreignKey: 'referredBy'});
User.belongsTo(User, {as: 'referrer', foreignKey: 'referredBy'});

User.belongsTo(Address, {foreignKey: 'addressId', as: 'address'});

export default User;