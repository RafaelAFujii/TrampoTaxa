import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const fixtureMarkers = [
  'Traga seu abridor e avental preto se tiver.',
  'Chegar com 20 minutos de antecedência na entrada de serviço lateral.',
];

function collectBundleText(directory: string): string {
  return readdirSync(directory).reduce((contents, name) => {
    const path = join(directory, name);
    const stats = statSync(path);
    return (
      contents +
      (stats.isDirectory()
        ? collectBundleText(path)
        : readFileSync(path, 'utf8'))
    );
  }, '');
}

describe('Web production bundle mock isolation', () => {
  it.skipIf(!existsSync(resolve(process.cwd(), 'dist')))(
    'does not include mock fixture markers in apps/web/dist',
    () => {
    const bundleDirectory = resolve(process.cwd(), 'dist');
    const bundle = collectBundleText(bundleDirectory);
    for (const marker of fixtureMarkers) {
      expect(bundle.includes(marker), `production bundle contains mock fixture data: ${marker}`).toBe(
        false
      );
    }
    }
  );
});
