import { describe, it, expect } from 'vitest';

describe('env config', () => {
  it('provides defaults for optional vars', async () => {
    // Import fresh — vitest.config.ts sets NODE_ENV=test
    const { env } = await import('./config.ts');
    expect(env.PORT).toBe(3001);
    expect(env.NODE_ENV).toBe('test');
    expect(env.MAPLE_LLM_MODEL).toBe('claude-opus-4-6');
    expect(env.MAPLE_LLM_MAX_TOKENS).toBe(8096);
  });

  it('coerces PORT to a number', async () => {
    const { env } = await import('./config.ts');
    expect(typeof env.PORT).toBe('number');
  });
});
