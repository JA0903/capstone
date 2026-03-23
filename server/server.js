import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/sequelize.js';
import { setupSocket } from './socket/socketConfig.js';
import adminRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import userRouter from './routes/userRoutes.js';
import reportsRouter from './routes/reportsRoutes.js';
import seedRouter from './routes/seedRoutes.js';
import "./cron/otpCleaner.js";
import otpRouter from './routes/otpRoutes.js';
import applicantsRouter from './routes/applicantsRoutes.js';
import orientationsRouter from './routes/orientationsRoutes.js';
import hiredRouter from './routes/hiredRoutes.js';
import rejectedBlacklistedRouter from './routes/rejectedBlacklistedRoutes.js';
import seedCaviteAndLaguna from './seeds/seedCaviteLaguna.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;
let io;

app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(
            new Error("CORS policy does not allow access from this origin"),
            false
        );
    },
    credentials: true,
    exposedHeaders: [
        "RateLimit-Reset",
        "RateLimit-Remaining",
        "RateLimit-Limit"
    ]
}));

app.use(cookieParser());

// Serve uploaded files as static assets
app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRouter);
app.use('/api/company', companyRouter);
app.use('/api/job', jobRouter);
app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/orientations', orientationsRouter);
app.use('/api/hired', hiredRouter);
app.use('/api/rejectedBlacklisted', rejectedBlacklistedRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/seed', seedRouter);

// TEST
app.get('/', (req, res) => {
    res.send("API Working")
})

// START SERVER
const startServer = async () => {
    try {
        await connectToDatabase();
        
        // Seed Cavite and Laguna data on startup
        if (process.env.SEED_DATA === 'true') {
            console.log('🌱 Running seed data...');
            await seedCaviteAndLaguna();
        }
        
        const { server, io: socketIO } = setupSocket(app);
        io = socketIO;
        
        // Make io globally accessible
        globalThis.io = io;
        
        server.listen(port, () => {
            console.log(`Server running on PORT: ${port}`);
            console.log(`🔌 Socket.IO is ready for real-time connections`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

startServer();