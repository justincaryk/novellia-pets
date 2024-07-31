module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: process.env.NODE_ENV === 'docker' ? './tsconfig.json' : './frontend/tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },

  // all plugins (eslint-plugin-xxx) go here:
  plugins: [
    '@typescript-eslint',
    '@next/eslint-plugin-next', // https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/lib/index.js
    'jsx-a11y',
    'jest',
  ],

  // all configs (eslint-config-xxx) go here:
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // contains rules that specifically require type information
    'plugin:@next/next/recommended',
    'next', // https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/package.json
    'next/core-web-vitals',
    'plugin:jsx-a11y/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  rules: {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
  },
};
