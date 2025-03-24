import express from 'express';
import {
    postCheckIn,
    getMyCheckIns,
    getTeamCheckIns
} from '../controllers/checkin.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate, postCheckIn);
router.get('/', authenticate, getMyCheckIns);
router.get('/team', authenticate, requireAdmin, getTeamCheckIns);

export default router;
