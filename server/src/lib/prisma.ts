import { PrismaClient } from '@prisma/client';
import { getDbConnectionUrl } from '../utils/awsSecrets';

let prisma: PrismaClient;

export const initPrisma = async (): Promise<PrismaClient> => {
    if (!prisma) {
        const dbUrl = await getDbConnectionUrl();

        process.env.DATABASE_URL = dbUrl;

        prisma = new PrismaClient();
        await prisma.$connect();
    }

    return prisma;
};
