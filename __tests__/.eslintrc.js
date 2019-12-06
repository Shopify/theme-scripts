module.exports = {
  root: true,
  extends: [
    'plugin:shopify/esnext',
    'plugin:shopify/node',
    'plugin:shopify/prettier'
  ],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    'shopify/strict-component-boundaries': 'off'
  }
};
