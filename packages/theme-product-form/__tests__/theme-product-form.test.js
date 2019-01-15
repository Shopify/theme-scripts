/**
 * @jest-environment jsdom
 */

import {getVariantFromOptionArray} from '@shopify/theme-product';
import {getUrlWithVariant, ProductForm} from '../theme-product-form';
import productJSON from '../__fixtures__/product-object.json';

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
  function expectFormEventDataset(
    event,
    {
      options = ['Silver', '220 Volts', 'Small'],
      quantity = 3,
      properties = [{}, {}]
    }
  ) {
    expect(event.dataset.options).toMatchObject(options);
    expect(event.dataset.variant).toMatchObject(
      getVariantFromOptionArray(productJSON, options)
    );
    expect(event.dataset.properties.length).toBe(properties.length);
    expect(event.dataset.quantity).toBe(quantity);
  }

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
      <select name="options[Size]">
        <option value="Small" selected="selected">Small</option>
        <option value="Large">Large</option>
      </select>
      <input type="number" name="quantity" value=3 />
      <input type="text" name="properties[Message]" />
      <input type="hidden" value="something" name="properties[Hidden]" />
    </form>`;
  });

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

    expect(productForm.optionInputs.length).toBe(3);
  });

  test('assign all quantity inputs which have the name attribute equal to "quantity" to .quantityInputs', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.quantityInputs.length).toBe(1);
  });

  test('assign all property inputs which have the name attribute that start with "properties" to .propertyInputs', () => {
    const element = document.getElementById('form');
    const productForm = new ProductForm(element, productJSON);

    expect(productForm.propertyInputs.length).toBe(2);
  });

  test('calls the method assigned to onOptionChange option when the value of an option input changes', () => {
    const element = document.getElementById('form');
    const colorSelect = document.querySelector('[name="options[Color]"]');
    const sizeSelect = document.querySelector('[name="options[Size]"]');
    const changeEvent = new Event('change');
    const config = {
      onOptionChange: jest.fn()
    };
    const options = ['Cobalt', '220 Volts', 'Large'];

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
});
