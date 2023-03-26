module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/no-cycle': 'warn',

    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: 'components', group: 'internal' },
          { pattern: 'components/**', group: 'internal' },
          { pattern: 'error/**', group: 'internal' },
          { pattern: 'hooks', group: 'internal' },
          { pattern: 'hooks/**', group: 'internal' },
          { pattern: 'store', group: 'internal' },
          { pattern: 'utils', group: 'internal' },
          { pattern: 'features/**', group: 'internal' },
          { pattern: 'services/**', group: 'internal' },
          { pattern: 'i18n', group: 'internal' },
          { pattern: 'assets/**', group: 'internal' }
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  settings: {
    'import/resolver': {
      // typescript: {},
      node: {
        paths: ['src', 'src/components/*']
      }
    }
  }
};
