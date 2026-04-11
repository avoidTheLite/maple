import { describe, expect, it } from 'vitest';
import { computeLlmCacheKey, normalizeSongKeyPart } from './cacheKey.ts';

describe('normalizeSongKeyPart', () => {
  it('trims and lowercases', () => {
    expect(normalizeSongKeyPart('  Blue On Black  ')).toBe('blue on black');
  });

  it('collapses internal whitespace', () => {
    expect(normalizeSongKeyPart('Blue   on\t\nBlack')).toBe('blue on black');
  });
});

describe('computeLlmCacheKey', () => {
  it('matches for equivalent title/artist spacing and case', () => {
    const fp = 'same-fp';
    const model = 'claude-opus-4-6';
    const a = computeLlmCacheKey(fp, model, '  BLUE on BLACK  ', 'Kenny  wayne shepherd');
    const b = computeLlmCacheKey(fp, model, 'blue on black', 'kenny wayne shepherd');
    expect(a).toBe(b);
  });

  it('differs when normalized title differs', () => {
    const fp = 'fp';
    const model = 'm';
    expect(computeLlmCacheKey(fp, model, 'Song A', 'Artist')).not.toBe(
      computeLlmCacheKey(fp, model, 'Song B', 'Artist'),
    );
  });
});
