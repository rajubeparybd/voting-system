import { PrismaClient } from '@prisma/client';

const env = process.env.NODE_ENV;

const createPrismaClient = () =>
    new PrismaClient({
        log: env === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env !== 'production') globalForPrisma.prisma = db;
