import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import n from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';

/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      n,
    },
    rules: {
      // Enforce named exports only
      'import/no-default-export': 'error',
      // Enforce explicit return types on exported functions
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Enforce import type for type-only imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // No console — use logger
      'no-console': 'error',
      // Allow _-prefixed variables to be unused (required params, etc.)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Config files must use export default (framework requirement)
  {
    files: [
      '*.config.{js,ts,mjs,cjs}',
      '**/*.config.{js,ts,mjs,cjs}',
      'eslint.config.js',
      'packages/eslint-config/index.js',
    ],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  // Scripts may use console.log
  {
    files: ['**/scripts/**/*.ts', '**/scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
);
