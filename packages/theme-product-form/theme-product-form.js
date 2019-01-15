import Listeners from './listeners';
import { getVariantFromOptionArray } from '@shopify/theme-product';

var selectors = {
  idInput: '[name="id"]',
  optionInput: '[name^="options"]',
  quantityInput: '[name="quantity"]',
  propertyInput: '[name^="properties"]'
};

// Public Methods
// -----------------------------------------------------------------------------

/**
 * Returns a URL with a variant ID query parameter. Useful for updating window.history
 * with a new URL based on the currently select product variant.
 * @param {string} url - The URL you wish to append the variant ID to
 * @param {number} id  - The variant ID you wish to append to the URL
 * @returns {string} - The new url which includes the variant ID query parameter
 */

export function getUrlWithVariant(url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, '$1' + id);
  } else {
    return url.concat('?variant=').concat(id);
  }
}

/**
 * Constructor class that creates a new instance of a product form controller.
 *
 * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
 * @param {Object} product - A product object
 * @param {Object} options - Optional options object
 * @param {Function} options.onOptionChange - Callback for whenever an option input changes
 * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
 * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
 * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
 */
export function ProductForm(element, product, options) {
  this.element = element;
  this.product = _validateProductObject(product);

  options = options || {};

  this._listeners = new Listeners();
  this._listeners.add(this.element, 'submit', this._onSubmit.bind(this));

  this.optionInputs = this._initInputs(
    selectors.optionInput,
    options.onOptionChange
  );

  this.quantityInputs = this._initInputs(
    selectors.quantityInput,
    options.onQuantityChange
  );

  this.propertyInputs = this._initInputs(
    selectors.propertyInput,
    options.onPropertyChange
  );
}

/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */
ProductForm.prototype.destroy = function() {
  this._listeners.removeAll();
};

/**
 * Getter method which returns the array of currently selected option values
 *
 * @returns {Array} An array of option values
 */
ProductForm.prototype.options = function() {
  return this.inputs.map(function(input) {
    return input.value();
  });
};

// Private Methods
// -----------------------------------------------------------------------------
ProductForm.prototype._setIdInputValue = function(value) {
  var idInputElement = this.element.querySelector('[name="id"]');

  if (!idInputElement) {
    idInputElement = document.createElement('input');
    idInputElement.type = 'hidden';
    idInputElement.name = 'id';
    this.element.appendChild(idInputElement);
  }

  idInputElement.value = value.toString();
};

ProductForm.prototype._onSubmit = function(event) {
  event.dataset = this._getProductFormEventData();

  this._setIdInputValue(event.dataset.variant.id);

  if (this.options.onFormSubmit) {
    this.options.onFormSubmit(event);
  }
};

ProductForm.prototype._onFormEvent = function(cb) {
  if (typeof cb === 'undefined') {
    return Function.prototype;
  }

  return function(event) {
    event.dataset = this._getProductFormEventData();
    cb(event);
  }.bind(this);
};

ProductForm.prototype._initInputs = function(selector, cb) {
  var elements = Array.prototype.slice.call(
    this.element.querySelectorAll(selector)
  );

  return elements.map(
    function(element) {
      this._listeners.add(element, 'change', this._onFormEvent(cb));
      return element;
    }.bind(this)
  );
};

ProductForm.prototype._getProductFormEventData = function() {
  var dataset = {};

  dataset.options = this.optionInputs.map(function(input) {
    return input.value;
  });

  dataset.variant = getVariantFromOptionArray(this.product, dataset.options);

  dataset.properties = this.propertyInputs.map(function(input) {
    return {
      name: input.name,
      value: input.value
    };
  });

  dataset.quantity = this.quantityInputs[0]
    ? Number.parseInt(this.quantityInputs[0].value, 10)
    : 1;

  return dataset;
};

function _validateProductObject(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (typeof product.variants[0].options === 'undefined') {
    throw new TypeError(
      'Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route'
    );
  }

  return product;
}
