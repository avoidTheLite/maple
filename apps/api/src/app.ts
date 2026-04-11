import express from 'express';
import cors from 'cors';
import { errorHandler } from '@maple/util';
import { mapleGenerateDeps } from './generate/createGenerateDeps.ts';
import type { GenerateDeps } from './generate/generateService.ts';
import { createGenerateRouter } from './generate/generateRouter.ts';
import { createSheetsRouter } from './generate/sheetsRouter.ts';

const defaultGetDeps = (): GenerateDeps => mapleGenerateDeps;

export function createApp(getDeps: () => GenerateDeps = defaultGetDeps): express.Application {
  const app = express();

  app.use(cors());

  app.use('/api/generate', createGenerateRouter(getDeps));
  app.use('/api/sheets', createSheetsRouter(getDeps));

  app.use(errorHandler);

  return app;
}

export const app = createApp();
