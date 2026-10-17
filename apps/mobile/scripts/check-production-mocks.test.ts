import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const bundleDirectory = resolve(process.cwd(), 'dist');
const fixtureMarkers = [
  'cgig-101',
  'Traga seu abridor e avental preto se tiver.',
  'Chegar com 20 minutos de antecedência na entrada de serviço lateral.',
];

function collectBundleText(directory: string): string {
  return readdirSync(directory).reduce((contents, name) => {
    const path = join(directory, name);
    return (
      contents +
      (statSync(path).isDirectory() ? collectBundleText(path) : readFileSync(path, 'utf8'))
    );
  }, '');
}

describe('Mobile production bundle mock isolation', () => {
  it.skipIf(!existsSync(bundleDirectory))(
    'does not include fixture-only data in apps/mobile/dist',
    () => {
      const bundle = collectBundleText(bundleDirectory);
      for (const marker of fixtureMarkers) {
        expect(bundle.includes(marker), `production bundle contains mock fixture data: ${marker}`).toBe(
          false
        );
      }
    }
  );
});
