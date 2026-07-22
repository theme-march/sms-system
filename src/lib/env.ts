import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().default('mysql://root:password@localhost:3306/school_management'),
  SESSION_SECRET: z.string().default('super-secret-session-key-change-in-production-12345'),
  SEED_ADMIN_NAME: z.string().default('Super Admin'),
  SEED_ADMIN_EMAIL: z.string().default('admin@school.com'),
  SEED_ADMIN_PASSWORD: z.string().default('AdminPassword123!'),
  APP_URL: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  APP_URL: process.env.APP_URL,
});
