import { describe, expect, it } from 'vitest';
import { validateOpenApiTags } from './validate-openapi-tags';

describe('validateOpenApiTags', () => {
  it('accepts unique ASCII kebab-case tags and matching operation references', () => {
    expect(
      validateOpenApiTags({
        tags: [{ name: 'autenticacao-usuarios' }, { name: 'gigs-vagas2' }],
        paths: {
          '/auth/me': {
            get: { tags: ['autenticacao-usuarios'] },
          },
          '/gigs': {
            get: { tags: ['gigs-vagas2'] },
          },
        },
      })
    ).toEqual([]);
  });

  it.each([
    'Autenticacao',
    'autenticação',
    'autenticacao--usuarios',
    '-usuarios',
    'usuarios-',
    'usuarios_vagas',
    'usuarios vagas',
  ])('rejects unsafe tag name "%s"', (name) => {
    expect(
      validateOpenApiTags({
        tags: [{ name }],
        paths: {},
      })
    ).toContain(`Invalid OpenAPI tag name "${name}"`);
  });

  it('rejects undeclared or invalid tags referenced by operations', () => {
    expect(
      validateOpenApiTags({
        tags: [{ name: 'gigs' }],
        paths: {
          '/auth/me': {
            get: { tags: ['autenticação', 'unknown-tag'] },
          },
        },
      })
    ).toEqual([
      'Invalid OpenAPI tag name "autenticação" referenced by GET /auth/me',
      'Undeclared OpenAPI tag "unknown-tag" referenced by GET /auth/me',
    ]);
  });

  it('rejects duplicate declared tags', () => {
    expect(
      validateOpenApiTags({
        tags: [{ name: 'gigs' }, { name: 'gigs' }],
        paths: {},
      })
    ).toEqual(['Duplicate OpenAPI tag name "gigs"']);
  });
});
