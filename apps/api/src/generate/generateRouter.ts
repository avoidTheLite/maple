import { Router } from 'express';
import type { GenerateDeps } from './generateService.ts';
import { createGenerateController } from './generateController.ts';

export function createGenerateRouter(getDeps: () => GenerateDeps) {
  const router = Router();
  const { generate } = createGenerateController(getDeps);
  router.post('/', generate);
  return router;
}
