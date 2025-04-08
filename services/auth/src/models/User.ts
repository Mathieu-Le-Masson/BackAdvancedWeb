import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import UserAddress from './UserAddress';

class User extends Model {
    public id!: string;
    public name!: string;
    public firstName!: string;
    public email!: string;
    public phone!: string;
    public addressString!: string | null;
    public address!: UserAddress | null;
    public password!: string;
    public userType!: string;
    public referralCode!: string;
    public referredBy!: string | null;
    public isActive!: boolean;
    public siretNumber!: string | null;
    public IBAN!: string | null;
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
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    addressString: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: UserAddress,
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
        allowNull: true,
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
    },
    siretNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    IBAN: {
        type: DataTypes.STRING,
        allowNull: true,
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

// Relationship with UserAddress, several users can have the same address
User.belongsTo(UserAddress, {foreignKey: 'address', as: 'addressDetails'});

export default User;