import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'theme-cart.js',
    output: {
      file: 'dist/theme-cart.cjs.js',
      format: 'cjs'
    }
  },
  {
    input: 'theme-cart.js',
    output: {
      file: 'dist/theme-cart.js',
      format: 'iife',
      name: 'Shopify.theme.cart'
    }
  },
  {
    input: 'theme-cart.js',
    output: {
      file: 'dist/theme-cart.min.js',
      format: 'iife',
      name: 'Shopify.theme.cart'
    },
    plugins: [uglify()]
  }
];
