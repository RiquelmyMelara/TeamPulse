import { initPrisma } from '../lib/prisma';
import { initRedis } from '../utils/redis';
import dayjs from "dayjs";

export const createCheckIn = async (
    userId: string,
    mood: string,
    tasksCompleted: string,
    blockers?: string
) => {
    const prisma = await initPrisma();
    const redis = await initRedis();

    // Extra safety: Check DB for existing check-in today
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    const existingCheckIn = await prisma.checkIn.findFirst({
        where: {
            userId,
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    });

    if (existingCheckIn) {
        throw new Error("You've already checked in today.");
    }

    await redis.del('teamCheckIns');

    return prisma.checkIn.create({
        data: {
            userId,
            mood,
            tasksCompleted,
            blockers: blockers || null,
        },
    });
};

export const getUserCheckIns = async (userId: string) => {
    const prisma = await initPrisma();

    return prisma.checkIn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const getAllCheckIns = async () => {
    const redis = await initRedis();
    const prisma = await initPrisma();

    const cached = await redis.get('teamCheckIns');
    // Return cached data if available
    if (cached) return JSON.parse(cached);

    const checkIns = await prisma.checkIn.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
    });

    await redis.set('teamCheckIns', JSON.stringify(checkIns), 'EX', 60);
    return checkIns;
};