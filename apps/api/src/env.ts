import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  NODE_ENV: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
