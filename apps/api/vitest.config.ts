import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    env: {
      MAPLE_LLM_CACHE: 'read',
      MAPLE_LLM_CACHE_DIR: join(__dirname, 'fixtures', 'llm'),
      NODE_ENV: 'test',
    },
  },
});
