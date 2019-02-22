import resolve from "rollup-plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";
import { eslint } from "rollup-plugin-eslint";

export default [
  {
    input: "src/theme-predictive-search.js",
    output: {
      file: "dist/theme-predictive-search.cjs.js",
      format: "cjs"
    },
    plugins: [eslint(), resolve()]
  },
  {
    input: "src/theme-predictive-search.js",
    output: {
      file: "dist/theme-predictive-search.js",
      format: "iife",
      name: "Shopify.theme.PredictiveSearch"
    },
    plugins: [eslint(), resolve()]
  },
  {
    input: "src/theme-predictive-search.js",
    output: {
      file: "dist/theme-predictive-search.min.js",
      format: "iife",
      name: "Shopify.theme.PredictiveSearch"
    },
    plugins: [eslint(), resolve(), uglify()]
  }
];
