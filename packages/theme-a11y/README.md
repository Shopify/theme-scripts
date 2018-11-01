# @shopify/theme-a11y

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-a11y
```

and then import the functions you wish to use through ES6 imports:

```
import * as a11y from '@shopify/theme-a11y`;
```

If you prefer not to use a package manager, you can download the latest version of Theme A11y and include it in your project manually from the following links:

- [theme-a11y.js](http://unpkg.com/@shopify/theme-a11y@latest/dist/theme-a11y.js)
- [theme-a11y.min.js](http://unpkg.com/@shopify/theme-a11y@latest/dist/theme-a11y.min.js)

These files make Theme A11y accessible via the `Shopify.theme.a11y` global variable.

---

### accessibleLinks(messages, targetLinks, prefix)

Add a preventive message to external links and links that open to a new window.
This is being used to provide better accessibility experience.

- `messages`: Custom messages object to overwrite with keys: newWindow, external, newWindowExternal
- `messages.newWindow` - When the link opens in a new window (e.g. `target="_blank"`)
- `messages.external` - When the link is external (e.g. www.cnn.com)
- `messages.newWindowExternal` - When the link is external and opens in a new window (`<a href="http://www.shopify.com" target="_blank">Shopify</a>`)
- `targetLinks`: Links selector to be targeted (Optional)
- `prefix`: Prefix to namespace "id" of the messages
