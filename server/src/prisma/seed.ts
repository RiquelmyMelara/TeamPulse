import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const salt = await bcrypt.genSalt(10);

    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@teampulse.com' },
        update: {},
        create: {
            email: 'admin@teampulse.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'admin',
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'user@teampulse.com' },
        update: {},
        create: {
            email: 'user@teampulse.com',
            name: 'Regular User',
            password: userPassword,
            role: 'user',
        },
    });

    await prisma.checkIn.createMany({
        data: [
            {
                userId: user.id,
                mood: 'happy',
                tasksCompleted: 'Finished feature X',
                blockers: null,
            },
            {
                userId: user.id,
                mood: 'neutral',
                tasksCompleted: 'Wrote some tests',
                blockers: 'Waiting for API spec',
            },
            {
                userId: admin.id,
                mood: 'frustrated',
                tasksCompleted: 'Handled team sync',
                blockers: 'Deployment issues',
            },
        ],
    });

    console.log('Seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
