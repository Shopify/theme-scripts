import { uglify } from "rollup-plugin-uglify";

export default [
  {
    input: "theme-addresses.js",
    output: {
      file: "dist/theme-addresses.cjs.js",
      format: "cjs"
    },
  },
  {
    input: "theme-addresses.js",
    output: {
      file: "dist/theme-addresses.js",
      format: "iife",
      name: "Shopify.theme.addresses"
    },
  },
  {
    input: "theme-addresses.js",
    output: {
      file: "dist/theme-addresses.min.js",
      format: "iife",
      name: "Shopify.theme.addresses"
    },
    plugins: [uglify()]
  }
];
