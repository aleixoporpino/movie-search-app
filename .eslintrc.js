/**
 * ESLint configuration file
 */
const prettierConfig = require('./prettier.config.js');

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['prettier', 'react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'prettier/prettier': [2, prettierConfig],
    'import/no-webpack-loader-syntax': 'off',
    'no-debugger': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'max-len': 'off',
    'react/prop-types': 'warn',
    'react/forbid-prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'no-useless-escape': 'warn',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['input'],
      },
    ],
    'import/no-named-as-default': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-props-no-spreading': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
