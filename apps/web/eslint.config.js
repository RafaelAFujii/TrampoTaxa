import tsPlugin from 'typescript-eslint';

export default [
  ...tsPlugin.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'build/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      '**/*.min.js',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
