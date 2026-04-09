import { Router } from 'express';
import type { GenerateDeps } from './generateService.ts';
import { loadSheetFromRepo, SheetLoadError } from './generateService.ts';

export function createSheetsRouter(getDeps: () => GenerateDeps) {
  const router = Router();

  router.get('/:slug', async (req, res) => {
    const slug = req.params.slug ?? '';
    try {
      const song = await loadSheetFromRepo(slug, getDeps());
      res.json(song);
    } catch (err) {
      if (err instanceof SheetLoadError) {
        if (err.code === 'INVALID_SLUG') {
          res.status(400).json({ error: err.message });
          return;
        }
        if (err.code === 'NOT_FOUND') {
          res.status(404).json({ error: err.message });
          return;
        }
        if (err.code === 'INVALID_JSON' || err.code === 'VALIDATION') {
          res.status(422).json({ error: err.message });
          return;
        }
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to load sheet.' });
    }
  });

  return router;
}
