/**
 * @jest-environment jsdom
 */

import {getVariantFromSerializedArray} from '@shopify/theme-product';
import {getUrlWithVariant, ProductForm} from '../theme-product-form';
import productJSON from '../__fixtures__/product-object.json';

const defaultVariant = productJSON.variants[0];
const defaultQuantity = 3;
const defaultOptions = [
  {name: 'options[Color]', value: 'Silver'},
  {name: 'options[Voltage]', value: '220 Volts'},
  {name: 'options[Size]', value: 'Small'}
];
const defaultProperties = [
  {name: 'properties[Message]', value: 'derp'},
  {name: 'properties[Hidden]', value: 'something'},
  {name: 'properties[Subscribe]', value: 'true'}
];

beforeEach(() => {
  document.body.innerHTML = `
  <form id="form">
    <select name="options[Color]">
      <option value="Silver" selected="selected">Silver</option>
      <option value="Nickel">Nickel</option>
      <option value="Cobalt">Cobalt</option>
      <option value="White">White</option>
    </select>

    <select name="options[Voltage]">
      <option value="220 Volts" selected="selected">220 Volts</option>
      <option value="110 Volts">110 Volts</option>
    </select>

    <input type="radio" name="options[Size]" value="Small" checked />
    <input type="radio" name="options[Size]" value="Large" />

    <input type="number" name="quantity" value=3 />

    <input type="text" name="properties[Message]" value="derp" />
    <input type="hidden" value="something" name="properties[Hidden]" />
    <input type="checkbox" value=true name="properties[Subscribe]" checked/>
  </form>`;
});

function expectFormEventDataset(
  event,
  {
    options = defaultOptions,
    quantity = defaultQuantity,
    properties = defaultProperties
  }
) {
  expect(event.dataset.options).toMatchObject(options);
  expect(event.dataset.variant).toMatchObject(
    getVariantFromSerializedArray(productJSON, options)
  );
  expect(event.dataset.properties.length).toBe(properties.length);
  expect(event.dataset.properties).toMatchObject(properties);
  expect(event.dataset.quantity).toBe(quantity);
}

describe('getUrlWithVariant()', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof getUrlWithVariant).toBe('function');
  });

  test('adds the "variant" query parameter if it does not exist in the URL', () => {
    expect(getUrlWithVariant('https://shop1.myshopify.com', 12345678)).toBe(
      'https://shop1.myshopify.com?variant=12345678'
    );
  });

  test('replaces the value of the "variant" query parameter if it does already exist in the URL', () => {
    expect(
      getUrlWithVariant(
        'https://shop1.myshopify.com?variant=12345678',
        87654321
      )
    ).toBe('https://shop1.myshopify.com?variant=87654321');
  });

  test('does not modify query parameters that do not have the "variant" key', () => {
    expect(
      getUrlWithVariant(
        'https://shop1.myshopify.com?variant=12345678&id=12345678',
        87654321
      )
    ).toBe('https://shop1.myshopify.com?variant=87654321&id=12345678');
    expect(
      getUrlWithVariant(
        'https://shop1.myshopify.com?id=12345678&variant=12345678',
        87654321
      )
    ).toBe('https://shop1.myshopify.com?id=12345678&variant=87654321');
  });
});

describe('ProductForm()', () => {
  test('is a constructor', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm).toBeInstanceOf(ProductForm);
  });

  test('throws an error if the first argument is not a DOM element', () => {
    expect(() => new ProductForm(null, productJSON)).toThrowError(TypeError);
  });

  test('throws an error if the second argument is not a valid product object', () => {
    const element = document.getElementById('form');
    expect(() => new ProductForm(element)).toThrowError(TypeError);
  });

  test('assigns the form element that was passed as the first argument to .element', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.element).toBe(element);
  });

  test('assigns the product object that is passed as the seconds argument to .product', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.element).toBe(element);
  });

  test('assigns all option inputs which have a name attribute that start with "options" to .optionInputs', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.optionInputs.length).toBe(4);
  });

  test('assign all quantity inputs which have the name attribute equal to "quantity" to .quantityInputs', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.quantityInputs.length).toBe(1);
  });

  test('assign all property inputs which have the name attribute that start with "properties" to .propertyInputs', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.propertyInputs.length).toBe(defaultProperties.length);
  });

  test('calls the method assigned to onOptionChange option when the value of an option input changes', () => {
    const element = document.getElementById('form');
    const colorSelect = document.querySelector('[name="options[Color]"]');
    const sizeSelect = document.querySelector('[name="options[Size]"]');
    const changeEvent = new Event('change');
    const config = {
      onOptionChange: jest.fn()
    };
    const options = [
      {name: 'options[Color]', value: 'Cobalt'},
      {name: 'options[Voltage]', value: '220 Volts'},
      {name: 'options[Size]', value: 'Large'}
    ];

    const productForm = new ProductForm(element, productJSON, config);

    sizeSelect.value = 'Large';
    colorSelect.value = 'Cobalt';
    colorSelect.dispatchEvent(changeEvent);

    expect(config.onOptionChange).toHaveBeenCalledWith(changeEvent);
    expectFormEventDataset(changeEvent, {options});
  });

  test('calls the method assigned to onQuantityChange option when the value of a quantity input changes', () => {
    const element = document.getElementById('form');
    const quantityElement = document.querySelector('[name="quantity"]');
    const changeEvent = new Event('change');
    const options = {
      onQuantityChange: jest.fn()
    };
    const quantity = 10;

    const productForm = new ProductForm(element, productJSON, options);

    quantityElement.value = quantity;
    quantityElement.dispatchEvent(changeEvent);

    expect(options.onQuantityChange).toHaveBeenCalledWith(changeEvent);
    expectFormEventDataset(changeEvent, {quantity});
  });

  test('calls the method assigned to onPropertyChange option when the value of a property input changes', () => {
    const element = document.getElementById('form');
    const propertyElement = document.querySelector('[name^="properties"]');
    const changeEvent = new Event('change');
    const options = {
      onPropertyChange: jest.fn()
    };
    const properties = [
      {name: 'properties[Message]', value: 'doh'},
      {name: 'properties[Hidden]', value: 'something'},
      {name: 'properties[Subscribe]', value: 'true'}
    ];

    const productForm = new ProductForm(element, productJSON, options);

    propertyElement.value = properties[0].value;
    propertyElement.dispatchEvent(changeEvent);

    expect(options.onPropertyChange).toHaveBeenCalledWith(changeEvent);
    expectFormEventDataset(changeEvent, {properties});
  });

  test('calls the method assigned to onFormSubmit option when the form is submitted', () => {
    const element = document.getElementById('form');
    const submitEvent = new Event('submit');
    const options = {
      onFormSubmit: jest.fn()
    };

    const productForm = new ProductForm(element, productJSON, options);

    productForm.element.dispatchEvent(submitEvent);

    expect(options.onFormSubmit).toHaveBeenCalledWith(submitEvent);
    expectFormEventDataset(submitEvent, {});
  });
});

describe('ProductForm.destroy()', () => {
  test('removes all event listeners that were assigned by ProductForm()', () => {
    const element = document.getElementById('form');
    const colorSelect = document.querySelector('[name="options[Color]"]');
    const quantityElement = document.querySelector('[name="quantity"]');
    const propertyElement = document.querySelector('[name^="properties"]');

    const changeEvent = new Event('change');
    const submitEvent = new Event('submit');

    const config = {
      onOptionChange: jest.fn(),
      onQuantityChange: jest.fn(),
      onPropertyChange: jest.fn(),
      onFormSubmit: jest.fn()
    };

    const productForm = new ProductForm(element, productJSON, config);

    productForm.destroy();

    colorSelect.dispatchEvent(changeEvent);
    quantityElement.dispatchEvent(changeEvent);
    propertyElement.dispatchEvent(changeEvent);
    productForm.element.dispatchEvent(submitEvent);

    expect(config.onOptionChange).not.toHaveBeenCalled();
    expect(config.onQuantityChange).not.toHaveBeenCalled();
    expect(config.onPropertyChange).not.toHaveBeenCalled();
    expect(config.onFormSubmit).not.toHaveBeenCalled();
  });
});

describe('ProductForm.options()', () => {
  test('returns an ordered array of option values', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.options()).toMatchObject(defaultOptions);
  });
});

describe('ProductForm.variant()', () => {
  test('returns the current variant of the form', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.variant()).toMatchObject(defaultVariant);
  });
});

describe('ProductForm.properties()', () => {
  test('returns a collection of objects containing the name and value of properties', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.properties()).toMatchObject(defaultProperties);
  });
});

describe('ProductForm.quantity()', () => {
  test('returns the current quantity specified in the form', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.quantity()).toBe(defaultQuantity);
  });

  test('returns 1 if no quantity input exists in the form', () => {
    document.body.innerHTML = `<form id="form"></form>`;
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.quantity()).toBe(1);
  });
});
