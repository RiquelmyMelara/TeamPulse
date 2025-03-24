import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
    res.send('TeamPulse API is up and running!');
});

export default app;