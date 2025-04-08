import { Sequelize } from 'sequelize';
import { Client } from 'pg';

const dbName = process.env.DB_NAME || 'develiry_db';            // Nom de la base de données
const dbUser = process.env.DB_USER || 'postgres';               // Nom d'utilisateur de la base de données
const dbPassword = process.env.DB_PASSWORD || 'postgres';       // Mot de passe de la base de données
const dbHost = process.env.DB_HOST || 'postgres';               // Hôte de la base de données
const dbPort = parseInt(process.env.DB_PORT || '5432');        // Port de la base de données

console.log('Configuration BD:', { dbName, dbUser, dbHost, dbPort, passwordDefined: !!dbPassword });

// Function to create database if it doesn't exist
export async function createDatabaseIfNotExists() {
    const client = new Client({                                 // PostgreSQL client
        host: dbHost,                                           // Hostname of the database server
        port: dbPort,                                           // Port number of the database server
        user: dbUser,                                           // Username for authentication
        password: dbPassword,                                   // Password for authentication
        database: 'postgres' // Connect to default database     // Database to check and create
    });

    try {
        await client.connect();                                                         // Connect to the PostgreSQL server
        console.log('Connected to postgres database to check if target DB exists');     // Log connection success

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);

        // Create if it doesn't exist
        if (res.rowCount === 0) {                                               //Vérifie si la base de données existe
            console.log(`Database ${dbName} does not exist, creating...`);      //Message indiquant que la base de données n'existe pas
            await client.query(`CREATE DATABASE ${dbName}`);                    // Crée la base de données
            console.log(`Database ${dbName} created successfully`);             //Message indiquant que la base de données a été créée avec succès
        } else {
            console.log(`Database ${dbName} already exists`);                   //Message indiquant que la base de données existe déjà
        }
    } catch (err) {
        console.error('Error creating database:', err);                         //Message d'erreur en cas d'échec de la création de la base de données
        throw err;                                                              // Propagation de l'erreur pour la gestion ultérieure
    } finally {
        await client.end();                                                     // Ferme la connexion au client PostgreSQL
    }
}

// Create the Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {       //Instance de Sequelize qui permet de se connecter à la base de données
    host: dbHost,                                                   //Hostname du serveur de base de données
    port: dbPort,                                                   //Port du serveur de base de données
    dialect: 'postgres',                                            //Dialect de la base de données
    logging: false                                                  //Logging désactivé
});

export default sequelize;