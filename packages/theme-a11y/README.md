# @shopify/theme-a11y

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-a11y
```

and then import the functions you wish to use through ES6 imports:

```
import * as a11y from '@shopify/theme-a11y';
```

If you prefer not to use a package manager, you can download the latest version of Theme A11y and include it in your project manually from the following links:

- [theme-a11y.js](http://unpkg.com/@shopify/theme-a11y@latest/dist/theme-a11y.js)
- [theme-a11y.min.js](http://unpkg.com/@shopify/theme-a11y@latest/dist/theme-a11y.min.js)

These files make Theme A11y accessible via the `Shopify.theme.a11y` global variable.

---

## Browser Support

Theme A11y uses a method not available in legacy browsers: `Element.matches()`. If you wish to support legacy browsers, make sure you add the following dependencies to your project:

```
yarn add element-matches
```

and then import them before you import Theme A11y:

```js
// Only need to import these once
import 'element-matches';

// Import @shopify/theme-a11y anywhere you need it
import * as a11y from '@shopify/theme-a11y';
```

## Methods

### accessibleLinks(elements, options)

Add a descriptive message to external links and links that open to a new window.

- `elements` - Specific elements to be targeted
- `options.messages` - Custom messages object to overwrite with keys: newWindow, external, newWindowExternal
- `options.messages.newWindow` - When the link opens in a new window (e.g. `target="_blank"`)
- `options.messages.external` - When the link is to a different host domain.
- `options.messages.newWindowExternal` - When the link is to a different host domain and opens in a new window.
- `options.prefix` - Prefix to namespace "id" of the messages
