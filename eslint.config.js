// eslint.config.js
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // TypeScript 파일만 ESLint 검사
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest', // 최신 ECMAScript 지원
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      jest: jestPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules, // TypeScript ESLint 기본 규칙
      ...jestPlugin.configs.recommended.rules, // Jest ESLint 기본 규칙
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
];
