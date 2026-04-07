import { z } from 'zod';

export const GenerateRequestSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
