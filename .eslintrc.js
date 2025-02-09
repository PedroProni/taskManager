module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base', // Para projetos Node.js
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-unused-vars": 'off',
  },
};
