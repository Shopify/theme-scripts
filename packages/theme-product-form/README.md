# @shopify/theme-product-form

Theme Product Form helps theme developers create and manage the state of their product forms. The library is decoupled from any rendering logic, allowing it to be used across any number of rendering engines, e.g. Liquid, VanillaJS, Handlebars, React, Vue.js, etc.

## Browser Support

This library is compatible with the following browsers:

| Chrome | Edge | Firefox | IE  | Opera | Safari |
| ------ | ---- | ------- | --- | ----- | ------ |
| ✓      | ✓    | ✓       | 11  | ✓     | ✓      |

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of the benefits of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-product-form
```

or

```
npm install --save @shopify/theme-product-from
```

and then import the functions you wish to use through ES6 imports:

```
import {ProductForm} from '@shopify/theme-product-form'
```

If you prefer not to use a package manager, you can download the latest version of Theme Product Form and include it in your project manually from the following links:

- [theme-product-form.js](http://unpkg.com/@shopify/theme-product-form@latest/dist/theme-product-form.js)
- [theme-product-form.min.js](http://unpkg.com/@shopify/theme-product-form@latest/dist/theme-product-form.min.js)

## Methods

### ProductForm(formElement, product, options)

Creates a new instance of a product form controller. This controller binds itself to form inputs and fires optional callback functions whenever the product form state changes.

A basic product form example in Liquid that is compatible with `ProductForm` would look something like the following:

```html
  {% form 'product', product, data-product-form: '', data-product-handle: product.handle %}
    {% unless product.has_only_default_variant %}
      {% for option in product.options_with_values %}
        <div class="js-enabled">

            <label for="Option{{ option.position }}">
              {{ option.name }}
            </label>

            {% comment %}
              All inputs that have `name=options[Name]` will be picked up by
              ProductForm, registered as an option input, and made available
              at ProductForm.optionsInputs
            {% endcomment %}

            <select
              id="Option{{ option.position }}"
              name="options[{{ option.name | escape }}]">
              {% for value in option.values %}
                <option
                  value="{{ value | escape }}"
                  {% if option.selected_value == value %}selected="selected"{% endif %}>
                    {{ value }}
                </option>
              {% endfor %}
            </select>
        </div>
      {% endfor %}
    {% endunless %}

    {% comment %}
      In order for this form to submit, it needs to contain an input with name="id".
      ProductForm() will automatically create this input (or make sure it has the
      right value set if it already exists) on form submit based on the
      currently selected variant. However, if JS is disabled we need a fallback.

      Include a single <select> element which allows users to select all variants
      as a fallback and present it only when JS is disabled. In addition,
      make sure you hide the option inputs declared above, like we do with the
      `.js-enabled` class which only shows its contents when JS is enabled.
    {% endcomment %}
    <noscript>
      <select name="id">
        {% for variant in product.variants %}
          <option
            {% if variant == current_variant %}selected="selected"{% endif %}
            {% unless variant.available %}disabled="disabled"{% endunless %}
            value="{{ variant.id }}">
              {{ variant.title }}
          </option>
        {% endfor %}
      </select>
    </noscript>

    {% comment %}
      Any input with `name="quantity"` will be picked up by ProductForm and
      registered as a quantity input. If a quantity input is not included, a
      default quantity of 1 is assumed.
    {% endcomment %}
    <label for="Quantity">{{ 'products.product.quantity' | t }}</label>
    <input type="number" id="Quantity" name="quantity" value="1" min="1">

    {% comment %}
      Line Item property inputs with `name="properties[NAME]"` will be picked up
      by ProductForm and registered as a properties input.
    {% endcomment %}
    <label for="Details">{{ 'products.product.details' | t }}</label>
    <textarea id="Details" name="properties[Details]"></textarea>

    <button
      type="submit"
      {% unless current_variant.available %}disabled="disabled"{% endunless %}>
        {{ 'products.product.add_to_cart' | t }}
    </button>

    {% comment %}
      Don't forget about the Dynamic Checkout buttons!
      https://help.shopify.com/en/themes/customization/store/dynamic-checkout-buttons
    {% endcomment %}
    {{ form | payment_button }}
  {% endform %}
```

To create a new instance of a product form controller, include the following in your theme:

```js
import { ProductForm } from '@shopify/theme-product-form';

const formElement = document.querySelector('[data-product-form]');
const productHandle = formElement.dataset.productHandle;

// Fetch the product data from the .js endpoint because it includes
// more data than the .json endpoint. Alternatively, you could inline the output
// of {{ product | json }} inside a <script> tag, with the downside that the
// data can never be cached by the browser.
//
// You will need to polyfill `fetch()` if you want to support IE11
fetch(`/products/${productHandle}.js`)
  .then(response => {
    return response.json();
  })
  .then(productJSON => {
    const productForm = new ProductForm(formElement, productJSON, {
      onOptionChange
    });
  });

// This function is called whenever the user changes the value of an option input
function onOptionChange(event) {
  const variant = event.dataset.variant;

  if (variant === null) {
    // The combination of selected options does not have a matching variant
  } else if (variant && !variant.available) {
    // The combination of selected options has a matching variant but it is
    // currently unavailable
  } else if (variant && variant.available) {
    // The combination of selected options has a matching variant and it is
    // available
  }
}
```

#### options

The third argument that can be passed to `ProductForm()` is an options object.

The callbacks that can be specified in the options object are as follows:

- _options.onOptionChange:_ A callback method that is fired whenever the user changes the value of an option input. The callback receives the event object described below as an arguement.
- _options.onQuantityChange:_ A callback method that is fired whenever the user changes the value of a quantity input. The callback receives the event object described below as an argument.
- _options.onPropertyChange:_ A callback method that is fired whenever the user changes the value of a property input. The callback receives the event object described below as an argument.
- _options.onFormSubmit:_ A callback method that is fired whenever the user submits the form. The callback receives the event object described below as an argument.

These options include several callback functions which are triggered on specific product form events. These functions receive the event as an argument, and that event includes the following payload:

- _event.dataset.options_: The serialized array of currently selected options returned by ProductForm.options()
- _event.dataset.variant_: The variant object returned by ProductForm.variant()
- _event.dataset.properties_: The serialized array of properties returned by ProductForm.properties()
- _event.dataset.quantity_: The number returned by ProductForm.quantity()

### ProductForm.destroy()

Cleans up the instance of ProductForm and removes all event listeners it assigned. Useful for cleaning things up in the Theme Editor when a section gets unloaded and loaded again after changing a setting.

```js
import {getUrlWithVariant, ProductForm} from '@shopify/theme-product-form';
import {register} from '@shopify/theme-sections';

register('my-section', {
  onLoad: () => {
    ...
    this.productForm = new ProductForm(formElement, productJSON, {onQuantityChange: this.onQuantityChange});
    ...
  },

  onUnload: () => {
    this.productForm.destroy();
  },

  onQuantityChange: (event) => {
    // code to run whenever the product quantity is updated
  }
})
```

### ProductForm.options()

Getter that returns a serialized array of names and values of option inputs in the form.

```js
const productForm = new ProductForm(formElement, productJSON);
const currentOptions = productForm.options(); // [{name: 'First Name', value: 'Tobi'}, ...]
```

### ProductForm.variant()

Getter that returns the variant that matches the currently selected options, or `null` if no match is found.

```js
const productForm = new ProductForm(formElement, productJSON);
const currentVariant = productForm.variant(); // { "id": 20230103745, "title": "Silver / 220 Volts / Small", ... }
```

### ProductForm.properties()

Getter that returns a serialized array of names and values of property inputs in the form.

```js
const productForm = new ProductForm(formElement, productJSON);
const currentProperties = productForm.properties(); // [{name: 'Message', value: 'Hello world'}, ...]
```

### ProductForm.quantity()

Getter that returns the value specified in the quantity input, or 1 if no quantity input exists.

```js
...
const productForm = new ProductForm(formElement, productJSON);
const currentProperties = productForm.quantity(); // 1
```

### getUrlWithVariant(baseUrl, variantId)

Utility function which returns a new URL with a `variant=` query parameter while not affecting other query parameters in the URL. Useful for replacing the browser history with the currently selected variant:

```js
import { getUrlWithVariant, ProductForm } from '@shopify/theme-product-form';

const productForm = new ProductForm(formElement, productJSON, {
  onOptionChange
});

function onOptionChange(event) {
  const variant = event.dataset.variant;

  if (!variant) return;

  const url = getUrlWithVariant(window.location.href, variant.id);
  window.history.replaceState({ path: url }, '', url);
}
```
