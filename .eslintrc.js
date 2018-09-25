module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:shopify/prettier',
    'plugin:es5/no-es2015',
    'plugin:es5/no-es2016'
  ],
  env: {
    browser: true
  },
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    'es5/no-modules': 'off'
  }
};
