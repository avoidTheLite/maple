import express from 'express';
import cors from 'cors';
import { mapleGenerateDeps } from './generate/createGenerateDeps.ts';
import type { GenerateDeps } from './generate/generateService.ts';
import { createGenerateRouter } from './generate/generateRouter.ts';
import { createSheetsRouter } from './generate/sheetsRouter.ts';

const defaultGetDeps = (): GenerateDeps => mapleGenerateDeps;

export function createApp(getDeps: () => GenerateDeps = defaultGetDeps) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/generate', createGenerateRouter(getDeps));
  app.use('/api/sheets', createSheetsRouter(getDeps));

  return app;
}

export const app = createApp();
