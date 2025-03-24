import { Request, Response } from 'express';
import {
    createCheckIn,
    getUserCheckIns,
    getAllCheckIns
} from '../services/checkin.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const postCheckIn = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { mood, tasksCompleted, blockers } = req.body;
        const checkIn = await createCheckIn(req.user.id, mood, tasksCompleted, blockers);
        res.status(201).json(checkIn);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const getMyCheckIns = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const checkIns = await getUserCheckIns(req.user.id);
        res.json(checkIns);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getTeamCheckIns = async (_req: Request, res: Response) => {
    try {
        const checkIns = await getAllCheckIns();
        res.json(checkIns);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
