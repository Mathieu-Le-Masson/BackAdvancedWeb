import bcrypt from 'bcrypt';
import User from '../models/User';

export const getAllUsers = async (): Promise<User[]> => {
    return await User.findAll({
        attributes: { exclude: ['password'] }
    });
};

export const getUserById = async (id: string): Promise<User | null> => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

export const updateUserData = async (id: string, userData: any): Promise<User | null> => {
    const user = await User.findByPk(id);

    if (!user) {
        return null;
    }

    // Gestion séparée du mot de passe
    if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
    }

    await user.update(userData);
    return user;
};

export const removeUser = async (id: string): Promise<boolean> => {
    const user = await User.findByPk(id);

    if (!user) {
        return false;
    }

    await user.destroy();
    return true;
};

export const getUserReferrals = async (id: string): Promise<User[]> => {
    const user = await User.findByPk(id);

    if (!user) {
        return [];
    }

    return await User.findAll({
        where: { referredBy: user.id },
        attributes: { exclude: ['password'] }
    });
};

export const deactivateUserAccount = async (id: string): Promise<User | null> => {
    const user = await User.findByPk(id);

    if (!user) {
        return null;
    }

    await user.update({ isActive: false });
    return user;
};