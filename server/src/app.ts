import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes'
import checkInRoutes from './routes/checkin.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/check-ins', checkInRoutes);

app.get('/health', (_req, res) => {
    res.send('TeamPulse API is up and running!');
});

export default app;