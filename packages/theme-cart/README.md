# @shopify/theme-cart

Theme Cart is a tiny library (<1kb min+gzip) that facilitates requests to [Shopify's Cart API](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api) and makes it easier to manage cart state.

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-cart
```

and then import the functions you wish to use through ES6 imports:

```
import * as cart from '@shopify/theme-cart';
```

If you prefer not to use a package manager, you can download the latest version of Theme Cart and include it in your project manually from the following links:

- [theme-cart.js](http://unpkg.com/@shopify/theme-cart@latest/dist/theme-cart.js)
- [theme-cart.min.js](http://unpkg.com/@shopify/theme-cart@latest/dist/theme-cart.min.js)

These files make Theme cart accessible via the `Shopify.theme.cart` global variable.

## Browser Support

Theme Cart uses two APIs not available to legacy browsers, Fetch and Promise. If you wish to support legacy browsers, make sure you add the following dependencies to your project:

```
yarn add unfetch es6-promise
```

and then import them before you import Theme Cart:

```js
// Only need to import these once
import 'unfetch/polyfill';
import 'es6-promise/auto';

// Import @shopify/theme-cart anywhere you need it
import * as cart from '@shopify/theme-cart';
```

## Methods

### getState()

Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

```js
cart.getState().then(state => {
  console.log(`Cart State: ${state}`);
});
```

### getItemIndex([key](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key))

Returns a promise which fulfills with the line item number.

> ⚠️ Line item indexes are base 1, so the first item in your cart has an index value of 1.

```js
cart.getItemIndex(key).then(index => {
  console.log(`Line item with ${key} has an index of ${index}`);
});
```

### getItem([key](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key))

Returns a promise which fulfills with the matching [line item](https://help.shopify.com/en/themes/liquid/objects/line_item).

```js
cart.getItem(key).then(item => {
  if (item === null) {
    console.log(`Line item does not exist with key '${key}'`);
  } else {
    console.log(`Found a line item with key '${key}':`, item);
  }
});
```

### addItem([id](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-variant_id), { [quantity](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-quantity), [properties](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties) })

Adds an item to your cart. If no quantity is specified, 1 item is added. Returns a promise which fulfills with the matching [line item](https://help.shopify.com/en/themes/liquid/objects/line_item).

> ⚠️ If the quantity specified is more then what is available, the promise will reject and the cart state will remain unchanged

```js
cart.addItem(id, { quantity, properties }).then(item => {
  console.log(
    `An item with a quantity of ${quantity} was added to your cart:`,
    item
  );
});
```

### updateItem([key](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key), { [quantity](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-quantity), [properties](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties) })

Changes the quantity and/or properties of an existing line item. Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

> ⚠️ If the quantity specified is more then what is available, the promise will still be fullfilled and the maximum number of available items is added to the cart.

> ⚠️ When you modify properties, the key value of the item changes. Make sure you record the new key value from the item returned by the resolved promise.

```js
cart.updateItem(key, { quantity }).then(state => {
  var item = state.items.find(item => item.key === key);
  console.log(`The item with key '${key}' now has quantity ${item.quantity}`);
});
```

### removeItem([key](https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key))

Removes an item from the cart. Returns a promise which fulfills with the updated [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

```js
cart.removeItem(key).then(state => {
  console.log(`There is now ${state.items.length} item(s) in your cart`);
});
```

### clearItems()

Removes all items from the cart. Returns a promise which fulfills with the updated [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

```js
cart.clearItems().then(state => {
  console.log(`Your cart is now empty.`);
});
```

### getAttributes()

Returns a promise which fulfills with the [cart attributes](https://help.shopify.com/en/themes/customization/cart/get-more-information-with-cart-attributes).

```js
cart.getAttributes().then(attributes => {
  if (attributes.giftWrapped) {
    console.log('The customer wants their order gift wrapped.');
  }
});
```

### updateAttributes()

Sets the value of the [cart attributes](https://help.shopify.com/en/themes/customization/cart/get-more-information-with-cart-attributes). Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

> ⚠️ This method will only add or overwrite attribute values. Passing an empty object will result in no change.

```js
cart.updateAttributes({ giftWrapped: false }).then(state => {
  if (state.attributes.giftWrapped) {
    console.log('The customer wants their order gift wrapped.');
  }
});
```

### clearAttributes()

Clears all values from the [cart attributes](https://help.shopify.com/en/themes/customization/cart/get-more-information-with-cart-attributes) object. Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

### getNote()

Returns a promise which fulfills with the value of the cart note.

```js
cart.getNote().then(note => {
  console.log('The customer has written the following note:', note);
});
```

### updateNote([note](https://help.shopify.com/en/themes/liquid/objects/cart#cart-note))

Sets the value of the cart note. Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

```js
cart.updateNote(note).then(state => {
  console.log('The customer has written the following note:', state.note);
});
```

### clearNote()

Clears the value of the cart note. Returns a promise which fulfills with the [cart state](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart).

```js
cart.clearNote().then(() => {
  console.log('The cart note has been cleared');
});
```

### getShippingRates()

Returns a promise which fulfills with an array of [shipping rate objects](https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates).

```js
cart.getShippingRates().then(rates => {
  console.log('Got shipping rates:', rates);
});
```
