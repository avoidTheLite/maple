import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '@maple/util';
import type { GenerateDeps } from './generateService.ts';
import { GenerateRequestSchema } from './generateSchema.ts';
import { generateSheet, LlmSheetError } from './generateService.ts';

export function createGenerateController(getDeps: () => GenerateDeps): {
  generate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
} {
  const generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = GenerateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      next(new ValidationError('Invalid generate request', parsed.error.flatten()));
      return;
    }

    const { title, artist } = parsed.data;

    try {
      const song = await generateSheet({ title, artist }, getDeps());
      res.json(song);
    } catch (err) {
      if (err instanceof LlmSheetError) {
        if (err.code === 'NO_TOOL_USE' || err.code === 'VALIDATION') {
          next(new AppError(err.message, 502));
          return;
        }
      }
      next(err);
    }
  };

  return { generate };
}
