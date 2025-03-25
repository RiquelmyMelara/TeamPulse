import { initPrisma } from '../lib/prisma';
import { initRedis } from '../utils/redis';

export const createCheckIn = async (
    userId: string,
    mood: string,
    tasksCompleted: string,
    blockers?: string
) => {
    const prisma = await initPrisma();
    const redis = await initRedis();

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