import { describe, it, expect } from 'vitest';
import { createLogger } from './logger.ts';

describe('createLogger', () => {
  it('returns a logger with the given module name', () => {
    const logger = createLogger({ module: 'test-module' });
    expect(logger.bindings().name).toBe('test-module');
  });

  it('defaults level to info', () => {
    const logger = createLogger({ module: 'test' });
    expect(logger.level).toBe('info');
  });

  it('respects an explicit level override', () => {
    const logger = createLogger({ module: 'test', level: 'debug' });
    expect(logger.level).toBe('debug');
  });
});
