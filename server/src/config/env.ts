import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  VAPI_PRIVATE_KEY: z.string().default(''),
  VAPI_PUBLIC_KEY: z.string().default(''),
  VAPI_ASSISTANT_ID: z.string().default(''),
  OPENROUTER_KEY: z.string().default(''),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
