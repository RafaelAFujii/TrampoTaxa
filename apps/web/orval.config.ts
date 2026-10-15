import { defineConfig } from 'orval';

export default defineConfig({
  trampotaxaApi: {
    input: {
      target: './docs/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: '../../packages/shared/src/api/endpoints',
      schemas: '../../packages/shared/src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
