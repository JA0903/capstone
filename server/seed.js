import bcrypt from 'bcrypt';
import { sequelize, connectToDatabase } from './config/sequelize.js';
import Admins from './models/Admin.js';
import Users from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDefaultAccounts = async () => {
    try {
        await connectToDatabase();

        let adminExists = false;
        let clientExists = false;

        // Check if admin already exists
        const existingAdmin = await Admins.findOne({ where: { email: 'admin@capstone.com' } });
        if (existingAdmin) {
            adminExists = true;
        } else {
            // Create default admin
            const hashedAdminPassword = await bcrypt.hash('Admin@12345', 10);
            
            await Admins.create({
                fullname: 'System Administrator',
                email: 'admin@capstone.com',
                password: hashedAdminPassword,
                role: 'HR Manager'
            });
        }

        // Check if client user already exists
        const existingClient = await Users.findOne({ where: { email: 'client@capstone.com' } });
        if (existingClient) {
            clientExists = true;
        } else {
            // Create default client user
            const hashedClientPassword = await bcrypt.hash('Client@12345', 10);
            
            await Users.create({
                fullname: 'Test Client',
                email: 'client@capstone.com',
                password: hashedClientPassword,
                phone: '+1234567890',
                isVerified: 'yes',
                savedJobs: []
            });
        }

        console.log('\n╔════════════════════════════════════════════════════════════════╗');
        console.log('║           ✅ DEFAULT ACCOUNTS CONFIGURATION                    ║');
        console.log('╚════════════════════════════════════════════════════════════════╝\n');

        if (!adminExists) {
            console.log('📧 ADMIN DASHBOARD');
            console.log('─────────────────────────────────────────────────────────────');
            console.log('  Email:    admin@capstone.com');
            console.log('  Password: Admin@12345');
            console.log('  Role:     HR Manager');
            console.log('  URL:      http://localhost:5174\n');
        } else {
            console.log('✅ Admin account already exists\n');
        }

        if (!clientExists) {
            console.log('👤 CLIENT APPLICATION');
            console.log('─────────────────────────────────────────────────────────────');
            console.log('  Email:    client@capstone.com');
            console.log('  Password: Client@12345');
            console.log('  Role:     Job Seeker');
            console.log('  URL:      http://localhost:5173\n');
        } else {
            console.log('✅ Client account already exists\n');
        }

        console.log('═════════════════════════════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating default accounts:', error);
        process.exit(1);
    }
};

seedDefaultAccounts();
