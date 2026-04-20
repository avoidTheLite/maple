import './loadEnv.ts';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  MAPLE_LLM_MODEL: z.string().default('claude-opus-4-6'),
  MAPLE_LLM_MAX_TOKENS: z.coerce.number().default(8096),
  MAPLE_LLM_CACHE: z.enum(['off', 'read', 'readwrite']).optional(),
  MAPLE_LLM_CACHE_DIR: z.string().optional(),
  MAPLE_SONGS_DIR: z.string().optional(),
  MAPLE_LAYOUTS_DIR: z.string().optional(),
});

export const env = envSchema.parse(process.env);
