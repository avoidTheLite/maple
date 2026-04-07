import express from 'express';
import cors from 'cors';
import { generateRouter } from './generate/generateRouter.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/generate', generateRouter);

export default app;
