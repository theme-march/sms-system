import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

try {
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: [],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
} catch {
  console.warn('[AI Studio] Database not connected — using mock proxy');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    count: async () => 0,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
    deleteMany: async () => ({ count: 0 }),
    createMany: async () => ({ count: 0 }),
    updateMany: async () => ({ count: 0 }),
  };
  prismaInstance = new Proxy({}, { get: () => noOp }) as unknown as PrismaClient;
}

export const prisma = prismaInstance;
export default prisma;
