import { Sequelize } from 'sequelize';
import { Client } from 'pg';

const dbName = process.env.DB_NAME || 'restaurants_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'postgres';
const dbPort = parseInt(process.env.DB_PORT || '5432');

console.log('Configuration BD:', { dbName, dbUser, dbHost, dbPort, passwordDefined: !!dbPassword });

// Function to create database if it doesn't exist
export async function createDatabaseIfNotExists() {
    const client = new Client({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: 'postgres' // Connect to default database
    });

    try {
        await client.connect();
        console.log('Connected to postgres database to check if target DB exists');

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);

        // Create if it doesn't exist
        if (res.rowCount === 0) {
            console.log(`Database ${dbName} does not exist, creating...`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created successfully`);
        } else {
            console.log(`Database ${dbName} already exists`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        throw err;
    } finally {
        await client.end();
    }
}

// Create the Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false
});

export default sequelize;