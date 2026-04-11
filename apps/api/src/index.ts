import './loadEnv.ts';
import { createLogger } from '@maple/util';
import { env } from './config.ts';
import { app } from './app.ts';

const logger = createLogger({ module: 'maple/api', level: env.LOG_LEVEL });

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, '@maple/api running');
});
