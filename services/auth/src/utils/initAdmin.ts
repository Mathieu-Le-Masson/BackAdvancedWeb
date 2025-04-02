// src/utils/initAdmin.ts
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';

export async function initAdminUser() {
    try {
        // Vérifier si un administrateur existe déjà
        const adminExists = await User.findOne({
            where: { userType: 'admin' }
        });

        if (!adminExists) {
            console.log('Aucun administrateur trouvé, création de l\'utilisateur admin par défaut...');

            // Générer un mot de passe hashé
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            // Créer l'administrateur
            await User.create({
                name: 'Admin',
                firstName: 'Super',
                email: 'admin@example.com',
                phone: '0600000000',
                password: hashedPassword,
                userType: 'admin',
                referralCode: uuidv4().substring(0, 8),
                isActive: true
            });

            console.log('Utilisateur administrateur créé avec succès');
        } else {
            console.log('Un administrateur existe déjà');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'administrateur:', error);
    }
}