import { Router } from 'express';
import express from 'express';
import type { Router as ExpressRouter } from 'express';
import type { GenerateDeps } from './generateService.ts';
import { createGenerateController } from './generateController.ts';

export function createGenerateRouter(getDeps: () => GenerateDeps): ExpressRouter {
  const router = Router();
  router.use(express.json());
  const { generate } = createGenerateController(getDeps);
  router.post('/', generate);
  return router;
}
