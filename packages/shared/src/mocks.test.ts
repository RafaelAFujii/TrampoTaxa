import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as sharedExports from './index';
import * as mocks from './mocks';

describe('shared mock fixture entry point', () => {
  it('keeps fixture data off the standard package entry point', () => {
    expect('mockGigs' in sharedExports).toBe(false);
    expect('INITIAL_CONTRACTOR_GIGS' in sharedExports).toBe(false);
    expect('INITIAL_CHAT_MESSAGES' in sharedExports).toBe(false);
  });

  it('exposes fixtures through the explicit mock entry point', () => {
    expect(mocks.mockGigs.length).toBeGreaterThan(0);
    expect(mocks.INITIAL_CONTRACTOR_GIGS.length).toBeGreaterThan(0);
    expect(mocks.INITIAL_CHAT_MESSAGES.length).toBeGreaterThan(0);
  });

  it('declares the explicit mock package subpath', () => {
    const manifest = JSON.parse(
      readFileSync(new URL('../package.json', import.meta.url), 'utf8')
    );
    expect(manifest.exports['./mocks']).toBe('./src/mocks.ts');
  });
});
