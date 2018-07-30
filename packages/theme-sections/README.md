# @shopify/theme-sections

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-sections
```

and then import the functions you wish to use through ES6 imports:

```
import * as sections from '@shopify/theme-sections`;
```

## Sections

### Default Properties

Every registered section has the following accessible properties:

| Property         | Description                               |
| ---------------- | ----------------------------------------- |
| `this.id`        | The unique ID for the section             |
| `this.container` | The DOM element for the section container |
| `this.type`      | The type of section                       |

### Register a section

```js
sections.register('type', { properties });
```

Register a section type to the list of available sections to be loaded. The section type should match the section type specified on the section container using `data-section-type` attribute.

```html
<div class="featured-product" data-section-type="featured-product" data-section-id="{{ section.id }}">
  <!-- section liquid -->
</div>
```

```js
import { register } from '@shopify/theme-sections';

register('featured-product', {
  publicMethod: function() {
    // Custom public section method
  },

  _privateMethod: function() {
    // Custom private section method
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function() {
    // Do something when a section instance is loaded
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload: function() {
    // Do something when a section instance is unloaded
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect: function() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect: function() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect: function() {
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect: function() {
    // Do something when a section block is deselected
  }
});
```

### Load sections

#### Single section

```js
import { load } from '@shopify/theme-sections';

load('featured-product');
```

Load a single section type on the page.

#### Multiple sections

```js
import { load } from '@shopify/theme-sections';

load(['featured-product', 'map']);
```

Load multiple section types on the page.

#### All sections

```js
import { load } from '@shopify/theme-sections';

load('*');
```

Load all registered sections on the page. This triggers the `onLoad()` method of each section and also fires the `load` section event.

### Section instances

```js
isInstance('type');
```

Returns a boolean that indicates if a particular section instance is present on
the page or not.

```js
getInstances('type');
```

Returns an array of instances that match the provided type(s).

```js
import { getInstances } from '@shopify/theme-sections';

const instances = getInstances('featured-product');
instances.forEach(function(instance) {
  console.log(
    'A section of type ' +
      instance.type +
      ' and with an id of ' +
      instance.id +
      'is loaded on the page'
  );
});
```

## Extensions

```js
this.extend(extension);
```

Creating an extension is simply creating an object with a list of methods you'd like to extend. For example, if you were extending a section it would look similar to this:

```js
var extension = {
  // the init method is a special method that is called when the extension is loaded. It is not available for the section to use.
  init: function() {
    this.on('section_load', function() {
      console.log('Do something else when the section loads');
    });
  },

  // Overrides the onLoad() method of the section
  onLoad: function() {
    console.log('My custom load event');
  },

  getProduct: function(id) {
    return this.products[id];
  },

  setProduct: function(product) {
    this.products[product.id] = product;
  }
};
```

### Extending sections

#### Single section

```js
sections.extend('type', extension);
```

Extend all current instances of a single section type

#### Multiple sections

```js
sections.extend(['types'], extension);
```

Extend all current instances of multiple section types

#### All sections

```js
sections.extend('*', extension);
```

Extend all current of any type
