import { uglify } from "rollup-plugin-uglify";

export default [
  {
    input: "theme-product.js",
    output: {
      file: "dist/theme-product.cjs.js",
      format: "cjs"
    }
  },
  {
    input: "theme-product.js",
    output: {
      file: "dist/theme-product.js",
      format: "iife",
      name: "Shopify.theme.product"
    }
  },
  {
    input: "theme-product.js",
    output: {
      file: "dist/theme-product.min.js",
      format: "iife",
      name: "Shopify.theme.product"
    },
    plugins: [uglify()]
  }
];