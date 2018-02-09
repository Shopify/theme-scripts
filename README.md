# Shopify Theme Scripts

> ⚠️ Shopify Theme Scripts is currently an Alpha release. You should expect breaking changes between updates and more bugs than a finalized release. We believe that by getting Theme Scripts in the hands of developer communtiy as soon as possible, we can gather critical feedback to make it an even bigger success.

Theme Scripts is a collection of handy utility libraries which help theme developers with problems unique to Shopify Themes.

The goal of each theme script is to be remain uncoupled from a particular UI. Typically, theme scripts should be used alongside a customized solution for a particular theme. For example, `@shopify/theme-cart` is a great way to interact with the Shopify Cart API and add and remove items, but it does not enforce a particular pattern to display or update the visual state of the cart.

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project. For example, to use [`@shopify/theme-cart`](https://github.com/Shopify/theme-scripts/tree/master/packages/theme-cart) in your project:

```
yarn add @shopify/theme-cart
```

and then import the functions you wish to use through ES6 imports:

```
import {updateNote} from '@shopify/theme-cart`;
```

Explore [each of packages](https://github.com/Shopify/theme-scripts/tree/master/packages) for documentation on how to use each Theme Script.

## CommonJS and ES Module Builds

Each Theme Script is transpiled to two versions:

1. A CommonJS version which can be imported using `require()` syntax.
2. A ES Module version which can be imported using `import` syntax.

Webpack detects the `"modules"` key when using importing via `import` so the correct version should automatically be imported for you.

## Contributing

For help on setting up the repo locally, building, testing, and contributing
please see [CONTRIBUTING.md](https://github.com/Shopify/starter-theme/blob/master/CONTRIBUTING.md).

## Code of Conduct

All developers who wish to contribute through code or issues, take a look at the
[Code of Conduct](https://github.com/Shopify/starter-theme/blob/master/CODE_OF_CONDUCT.md).

## License

MIT, see [LICENSE](https://github.com/Shopify/starter-theme/blob/master/LICENSE) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
