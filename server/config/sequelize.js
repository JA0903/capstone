import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 30000
        },
        connectTimeout: 5000
    }
);

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        // Sync and alter tables to match models
        await sequelize.sync({ alter: true });
        console.log('Database connection has been established successfully. Models are synced and altered.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export { sequelize, connectToDatabase };
