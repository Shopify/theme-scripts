# @shopify/theme-sections

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-sections
```

and then import the functions you wish to use through ES6 imports:

```
import * as rte from '@shopify/theme-sections`;
```
## Sections

### Default Properties

Every registered section has the following accessible properties:

Property               | Description
---                    | ---
`this.id`              | The unique ID for the section
`this.namespace`       | The namespace used for section events (equal to `this.id`)
`this.container`       | The DOM element for the section container
`this.$container`      | The section container as a jQuery object

### Register a section

```js
sections.register('type', { properties });
```

Register a section type to the list of available sections to be loaded. The section type should match the section type specified on the section container using `data-section-type` attribute.

```html
<div class="featured-product" data-section-type="featured-product" data-section-id="{{ section.id }}">
  <!-- section liquid -->
</div>

<script>
sections.register('featured-product', {
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
</script>
```

### Load sections

#### Single section

```js
sections.load('featured-product');
```

Load a single section type on the page.

#### Multiple sections

```js
sections.load([
  'featured-product',
  'map'
]);
```

Load multiple section types on the page.

#### All sections

```js
sections.load('*');
```

Load all registered sections on the page. This triggers the `onLoad()` method of each section and also fires the `load` section event.

### Section instances

```js
sections.isInstance('type');
```

Returns a boolean that indicates if a particular section instance is present on
the page or not.

```js
sections.getInstances('type');
```

Returns a promise. If there exists instances of the specified type, then the promise is resolved with the instances. If there does not exist any instances of the specified type, then the promise is rejected.

```js
sections.getInstances('featured-product').then(function(instances) {
  instances.forEach(function(instance) {
    console.log('A section of type ' + instance.type + ' and with an id of ' + instance.id + 'is loaded on the page');
  });
});
```

## Events

### Section events

Each section has the following default events:

- `'section_load'`: Triggered when the section instance is loaded on the page
- `'section_unload'`: Triggered when the section is unloaded
- `'section_select'`: Triggered when the section is selected in the Theme Editor
- `'section_deselect'`: Triggered when the section is deselected in the Theme Editor
- `'block_select'`: Triggered when a section block is selected in the Theme Editor
- `'block_deselect'`: Triggered when a section block is deselected in the Theme Editor

#### Attach event handler

```js
this.on('event', handler);
```

#### Execute all handlers attached to a section event

```js
this.trigger('event', [ payload ]);
```

Sections come with a built in event handling solution. The second paramater for any handler is always the instance of the section that fired the event. These event handlers will automatically be removed when the section is unloaded. For example:

```js
sections.register('featured-product', {
  onLoad: function() {
    this.on('update', this.doSomething.bind(this));
    this.on('updated', this.didSomething)
  },

  doSomething: function(event, instance) {
    console.log('Update this section instance');
    this.trigger('updated', [this.product]);
  },

  didSomething: function(event, instance, product) {
    console.log('Updated ' + product.name );
  }
});
```

### Global section events

#### Attach event handler

```js
sections.on('event', handler);
```

#### Execute all handlers attached to a global section event

```js
sections.trigger('event', [ payload ]);
```

Trigger and listen to an event on all sections. For example:

```js
sections.trigger('update', [product]);

sections.on('updated', function(event, instance, product) {
  if (instance.type !== 'featured-product') { return; }
  console.log(product.name + 'was updated.');
});
```

### Global document events

#### Attach event handler

```js
this.document().on('event', handler);
```

#### Execute all handlers attached to document events

```js
this.document().trigger('event', [payload]);
```

Trigger or listen to specific global document events. These event handlers will automatically be removed when the section is unloaded.

```js
sections.register('featured-product', {
  onLoad: function() {
    this.document().on('click', function() {
      console.log('The document was clicked!');
    });
  },
});
```

### Global window events

#### Attach event handler

```js
this.window().trigger('event', [payload]);
```

#### Execute all handlers attached to window events

```js
this.window().on('event', handler);
```

Trigger or listen to specific global window events. These event handlers will automatically be removed when the section is unloaded.

```js
sections.register('featured-product', {
  onLoad: function() {
    this.window().on('scroll', function() {
      console.log('The window was scrolled!');
    });
  },
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
}
```

Importing an extension is the same process for both a section and a template:

```js
import socialSharing from '../extensions/social-sharing';

templates.register('Article Template', 'template-article', {
  onLoad: function() {
    this.extend(socialSharing);
  }
});
```

### Extending sections

#### Single section

```js
sections.extend('type', extension);
```

Extend all current and future instances of a single section type

#### Multiple sections

```js
sections.extend(['types'], extension);
```

Extend all current and future instances of multiple section types

#### All sections

```js
sections.extend('*', extension);
```

Extend all current and future sections of any type

### Extending template scripts

#### Single template script

```js
templates.extend('name', extension);
```

Extend all current and future instances of a single template script

#### Multiple template scripts

```js
templates.extend(['names'], extension);
```

Extend all current and future instances of multiple template scripts

#### All template scripts

```js
templates.extend('*', extension);
```

Extend all current and future templates of any type

## Custom JS

A `custom.js` file provided in themes for theme owners to edit, combined with all the new additions to sections, templates and extensions, should provide enough extensibility to not have to ever edit `theme.js`. This separate file could be included inside of `theme.liquid` and isn't minified.

Any additional JS that you would like to add can be done inside of `custom.js`. This allows you to add any custom JS that does not yet exist inside of the theme or functionality that can overwrite the current implementation. For instance, you can apply an extension before a section loads on the page.
```js
var sections = window.theme.sections;

var productExtension = {
  init: function() {

    // Assign 'variant_change' event handler
    this.on('variant_change', this._updateSKU.bind(this));
  },

  _updateSKU: function(event, instance, product, variant) {

    // Get any elements with a 'data-sku' attribute
    var $sku = $('[data-sku]');

    // If we don't get any elements with our selection then we have nothing to update
    if ($sku.length === 0) { return; }

    // Update the SKU value on the page
    $sku.text(variant.sku);
  }
};

sections.extend('product-template', productExtension);

// Add more JS...
```
