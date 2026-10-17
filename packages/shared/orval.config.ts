import { defineConfig } from 'orval';

export default defineConfig({
  trampotaxaApi: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/endpoints',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      override: {
        query: {
          version: 5,
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
