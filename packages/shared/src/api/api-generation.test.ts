import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('shared API generation ownership', () => {
  it('owns the OpenAPI source, Orval configuration, and generation command', () => {
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
    const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const config = readFileSync(join(root, 'orval.config.ts'), 'utf8');

    expect(manifest.scripts['api:generate']).toBeDefined();
    expect(config).toContain('./openapi.yaml');
    expect(config).toContain('./src/api/endpoints');
    expect(config).toContain('./src/api/model');
  });
});
