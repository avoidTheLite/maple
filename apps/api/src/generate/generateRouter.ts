import { Router } from 'express';
import { generateController } from './generateController.ts';

export const generateRouter = Router();

const controller = generateController();

generateRouter.post('/', controller.generate);
