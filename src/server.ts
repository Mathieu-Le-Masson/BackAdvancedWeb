import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import sequelize from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('BackAdvancedWeb API is running');
});

app.use('/users', userRoutes);

// Additional logging to debug the issue
console.log('Before attempting to synchronize database...');
console.log('Sequelize instance:', sequelize);

try {
    // Synchronize models with database
    console.log('Attempting to synchronize database...');
    sequelize.authenticate().then(() => {
        console.log('Database connection established');
        return sequelize.sync();
    }).then(() => {
        console.log('Database synchronized');
    }).catch((error) => {
        console.error('Unable to synchronize the database:', error);
    });
} catch (error) {
    console.error('Error during database synchronization:', error);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});