import { uglify } from "rollup-plugin-uglify";
import { eslint } from "rollup-plugin-eslint";

export default [
  {
    input: "src/theme-predictive-search-component.js",
    output: {
      file: "dist/theme-predictive-search-component.cjs.js",
      format: "cjs"
    },
    plugins: [eslint()]
  },
  {
    input: "src/theme-predictive-search-component.js",
    output: {
      file: "dist/theme-predictive-search-component.js",
      format: "iife",
      name: "Shopify.theme.PredictiveSearchComponent",
      globals: {
        "@shopify/theme-predictive-search": "Shopify.theme.PredictiveSearch"
      }
    },
    plugins: [eslint()]
  },
  {
    input: "src/theme-predictive-search-component.js",
    output: {
      file: "dist/theme-predictive-search-component.min.js",
      format: "iife",
      name: "Shopify.theme.PredictiveSearchComponent",
      globals: {
        "@shopify/theme-predictive-search": "Shopify.theme.PredictiveSearch"
      }
    },
    plugins: [eslint(), uglify()]
  }
];
