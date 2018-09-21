/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

import * as request from './request';
import * as validate from './validate';

/**
 * Returns the state object of the cart
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function getState() {
  return request.cart();
}

/**
 * Returns the index of the cart line item
 * @param {string} key The unique key of the line item
 * @returns {Promise} Resolves with the index number of the line item
 */
export function getItemIndex(key) {
  validate.key(key);

  return request.cart().then(function(state) {
    var index = -1;

    state.items.forEach(function(item, i) {
      index = item.key === key ? i + 1 : index;
    });

    if (index === -1) {
      return Promise.reject(
        new Error('Theme Cart: Unable to match line item with provided key')
      );
    }

    return index;
  });
}

/**
 * Fetches the line item object
 * @param {string} key The unique key of the line item
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export function getItem(key) {
  validate.key(key);

  return request.cart().then(function(state) {
    var lineItem = null;

    state.items.forEach(function(item) {
      lineItem = item.key === key ? item : lineItem;
    });

    if (lineItem === null) {
      return Promise.reject(
        new Error('Theme Cart: Unable to match line item with provided key')
      );
    }

    return lineItem;
  });
}

/**
 * Add a new line item to the cart
 * @param {number} id The variant's unique ID
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the line item object (See response of cart/add.js https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#add-to-cart)
 */
export function addItem(id, options) {
  options = options || {};

  validate.id(id);

  return request.cartAdd(id, options.quantity, options.properties);
}

/**
 * Changes the quantity and/or properties of an existing line item.
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @param {object} options Optional values to pass to /cart/add.js
 * @param {number} options.quantity The quantity of items to be added to the cart
 * @param {object} options.properties Line item property key/values (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-properties)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function updateItem(key, options) {
  validate.key(key);
  validate.options(options);

  return getItemIndex(key).then(function(line) {
    return request.cartChange(line, options);
  });
}

/**
 * Removes a line item from the cart
 * @param {string} key The unique key of the line item (https://help.shopify.com/en/themes/liquid/objects/line_item#line_item-key)
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function removeItem(key) {
  validate.key(key);

  return getItemIndex(key).then(function(line) {
    return request.cartChange(line, { quantity: 0 });
  });
}

/**
 * Sets all quantities of all line items in the cart to zero. This does not remove cart attributes nor the cart note.
 * @returns {Promise} Resolves with the state object of the cart (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart)
 */
export function clearItems() {
  return request.cartClear();
}

/**
 * Gets all cart attributes
 * @returns {Promise} Resolves with the cart attributes object
 */
export function getAttributes() {
  return request.cart().then(function(state) {
    return state.attributes;
  });
}

/**
 * Sets all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export function updateAttributes(attributes) {
  return request.cartUpdate({ attributes: attributes });
}

/**
 * Clears all cart attributes
 * @returns {Promise} Resolves with the cart state object
 */
export function clearAttributes() {
  return getAttributes().then(function(attributes) {
    for (var key in attributes) {
      attributes[key] = '';
    }
    return updateAttributes(attributes);
  });
}

/**
 * Gets cart note
 * @returns {Promise} Resolves with the cart note string
 */
export function getNote() {
  return request.cart().then(function(state) {
    return state.note;
  });
}

/**
 * Sets cart note
 * @returns {Promise} Resolves with the cart state object
 */
export function updateNote(note) {
  return request.cartUpdate({ note: note });
}

/**
 * Clears cart note
 * @returns {Promise} Resolves with the cart state object
 */
export function clearNote() {
  return request.cartUpdate({ note: '' });
}

/**
 * Get estimated shipping rates.
 * @returns {Promise} Resolves with response of /cart/shipping_rates.json (https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-shipping-rates)
 */
export function getShippingRates() {
  return request.cartShippingRates();
}
