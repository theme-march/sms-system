import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable. Set DATABASE_URL in your .env file.');
}

let prismaInstance: PrismaClient;
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (process.env.NODE_ENV !== 'production') {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  globalForPrisma.prisma = prismaInstance;
} else {
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;
export default prisma;
