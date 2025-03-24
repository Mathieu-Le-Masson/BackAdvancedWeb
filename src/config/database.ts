// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const dbName = process.env.DB_NAME || 'advancedwebdb';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'your_password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');

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