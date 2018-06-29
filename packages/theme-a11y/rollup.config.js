import { uglify } from "rollup-plugin-uglify";

export default [
  {
    input: "theme-a11y.js",
    output: {
      file: "dist/theme-a11y.cjs.js",
      format: "cjs"
    }
  },
  {
    input: "theme-a11y.js",
    output: {
      file: "dist/theme-a11y.js",
      format: "iife",
      name: "Shopify.theme.a11y"
    }
  },
  {
    input: "theme-a11y.js",
    output: {
      file: "dist/theme-a11y.min.js",
      format: "iife",
      name: "Shopify.theme.a11y"
    },
    plugins: [uglify()]
  }
];
