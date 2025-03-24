import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCheckIn = async (
    userId: string,
    mood: string,
    tasksCompleted: string,
    blockers?: string
) => {
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
    return prisma.checkIn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const getAllCheckIns = async () => {
    return prisma.checkIn.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
    });
};