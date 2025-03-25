import express from 'express';
import { initRedis } from '../utils/redis';

const router = express.Router();

router.get('/status', async (req, res) => {
    try {
        const redis = await initRedis();
        await redis.set('healthcheck', 'ok', 'EX', 10);
        const value = await redis.get('healthcheck');

        res.json({
            status: 'ok',
            redis: value === 'ok' ? 'connected' : 'unknown',
        });
    } catch (err) {
        console.error('Redis health check failed:', err);
        res.status(500).json({ status: 'error', redis: 'disconnected' });
    }
});

export default router;
