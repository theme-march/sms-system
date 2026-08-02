import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  SEED_ADMIN_NAME: z.string().min(1).optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(12).optional(),
  APP_URL: z.string().url(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  APP_URL: process.env.APP_URL,
});
