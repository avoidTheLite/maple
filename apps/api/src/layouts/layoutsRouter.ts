import { Router } from 'express';
import express from 'express';
import type { Router as ExpressRouter } from 'express';
import { AppError } from '@maple/util';
import type { GenerateDeps } from '../generate/generateService.ts';
import { LayoutError, loadLayoutConfig, saveLayoutConfig } from './layoutService.ts';

function mapLayoutError(err: LayoutError): AppError {
  if (err.code === 'INVALID_SLUG' || err.code === 'INVALID_TEMPLATE' || err.code === 'VALIDATION') {
    return new AppError(err.message, 400);
  }
  if (err.code === 'NOT_FOUND') {
    return new AppError(err.message, 404);
  }
  if (err.code === 'INVALID_JSON') {
    return new AppError(err.message, 422);
  }
  return new AppError(err.message, 500);
}

function getTemplateId(raw: unknown): string {
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim();
  }
  return 'standard';
}

export function createLayoutsRouter(getDeps: () => GenerateDeps): ExpressRouter {
  const router = Router();
  router.use(express.json());

  router.get('/:slug', async (req, res, next) => {
    const slug = req.params.slug ?? '';
    const templateId = getTemplateId(req.query.template);
    try {
      const layout = await loadLayoutConfig(getDeps().layoutsDir, slug, templateId);
      res.json(layout);
    } catch (err) {
      if (err instanceof LayoutError) {
        next(mapLayoutError(err));
        return;
      }
      next(err);
    }
  });

  router.put('/:slug', async (req, res, next) => {
    const slug = req.params.slug ?? '';
    const templateId = getTemplateId(req.query.template);
    try {
      const layout = await saveLayoutConfig(getDeps().layoutsDir, slug, templateId, req.body);
      res.json(layout);
    } catch (err) {
      if (err instanceof LayoutError) {
        next(mapLayoutError(err));
        return;
      }
      next(err);
    }
  });

  return router;
}
