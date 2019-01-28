import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'theme-product-form.js',
    output: {
      file: 'dist/theme-product-form.cjs.js',
      format: 'cjs'
    }
  },
  {
    input: 'theme-product-form.js',
    output: {
      file: 'dist/theme-product-form.js',
      format: 'iife',
      name: 'Shopify.theme.productForm'
    }
  },
  {
    input: 'theme-product-form.js',
    output: {
      file: 'dist/theme-product-form.min.js',
      format: 'iife',
      name: 'Shopify.theme.productForm'
    },
    plugins: [uglify()]
  }
];
