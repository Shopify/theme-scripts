import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'theme-sections.js',
    output: {
      file: 'dist/theme-sections.cjs.js',
      format: 'cjs'
    }
  },
  {
    input: 'theme-sections.js',
    output: {
      file: 'dist/theme-sections.js',
      format: 'iife',
      name: 'Shopify.theme.sections'
    }
  },
  {
    input: 'theme-sections.js',
    output: {
      file: 'dist/theme-sections.min.js',
      format: 'iife',
      name: 'Shopify.theme.sections'
    },
    plugins: [uglify()]
  }
];
