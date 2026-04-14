import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { AppError } from '@maple/util';
import type { GenerateDeps } from './generateService.ts';
import { loadSheetFromRepo, SheetLoadError } from './generateService.ts';

export function createSheetsRouter(getDeps: () => GenerateDeps): ExpressRouter {
  const router = Router();

  router.get('/:slug', async (req, res, next) => {
    const slug = req.params.slug ?? '';
    try {
      const song = await loadSheetFromRepo(slug, getDeps());
      res.json(song);
    } catch (err) {
      if (err instanceof SheetLoadError) {
        if (err.code === 'INVALID_SLUG') {
          next(new AppError(err.message, 400));
          return;
        }
        if (err.code === 'NOT_FOUND') {
          next(new AppError(err.message, 404));
          return;
        }
        if (err.code === 'INVALID_JSON' || err.code === 'VALIDATION') {
          next(new AppError(err.message, 422));
          return;
        }
      }
      next(err);
    }
  });

  return router;
}
