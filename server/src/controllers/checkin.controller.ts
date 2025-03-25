import { Request, Response } from 'express';
import {
    createCheckIn,
    getUserCheckIns,
    getAllCheckIns
} from '../services/checkin.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { initRedis } from '../utils/redis';
import dayjs from 'dayjs';

export const postCheckIn = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { mood, tasksCompleted, blockers } = req.body;
        const userId = req.user.id;
        const today = dayjs().format('YYYY-MM-DD');
        const redisKey = `checkin:${userId}:${today}`;

        const redis = await initRedis();
        const alreadyCheckedIn = await redis.get(redisKey);

        if (alreadyCheckedIn) {
            return res.status(409).json({
                message: "You've already checked in today.",
            });
        }

        const checkIn = await createCheckIn(userId, mood, tasksCompleted, blockers);

        // Prevent multiple check-ins for the day
        await redis.set(redisKey, 'true', 'EX', 86400);

        // Invalidate cache
        await redis.del(`checkins:user:${userId}`);
        await redis.del('checkins:team');

        res.status(201).json(checkIn);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getMyCheckIns = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const redis = await initRedis();
        const cacheKey = `checkins:user:${req.user.id}`;
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const checkIns = await getUserCheckIns(req.user.id);

        // Cache for 5 minutes
        await redis.set(cacheKey, JSON.stringify(checkIns), 'EX', 300);

        res.json(checkIns);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getTeamCheckIns = async (_req: Request, res: Response) => {
    try {
        const redis = await initRedis();
        const cacheKey = 'checkins:team';
        const cached = await redis.get(cacheKey);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const checkIns = await getAllCheckIns();

        // Cache for 5 minutes
        await redis.set(cacheKey, JSON.stringify(checkIns), 'EX', 300);

        res.json(checkIns);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};