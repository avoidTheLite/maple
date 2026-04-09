import type { Request, Response } from 'express';
import type { GenerateDeps } from './generateService.ts';
import { GenerateRequestSchema } from './generateSchema.ts';
import { generateSheet, LlmSheetError } from './generateService.ts';

export function createGenerateController(getDeps: () => GenerateDeps) {
  const generate = async (req: Request, res: Response): Promise<void> => {
    const parsed = GenerateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { title, artist } = parsed.data;

    try {
      const song = await generateSheet({ title, artist }, getDeps());
      res.json(song);
    } catch (err) {
      if (err instanceof LlmSheetError) {
        if (err.code === 'NO_TOOL_USE') {
          res.status(502).json({ error: err.message });
          return;
        }
        if (err.code === 'VALIDATION') {
          res.status(502).json({ error: err.message });
          return;
        }
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to generate sheet.' });
    }
  };

  return { generate };
}
