/**
 * @jest-environment jsdom
 */

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
  beforeAll(() => {
    document.body.innerHTML = `
    <form id="form">
      <select name="options[Color]" data-product-form-option="" data-index="option1">
        <option value="Silver" selected="selected">Silver</option>
        <option value="Nickel">Nickel</option>
        <option value="Cobalt">Cobalt</option>
        <option value="White">White</option>
      </select>
      <select name="options[Voltage]" data-product-form-option="" data-index="option2">
        <option value="220 Volts" selected="selected">220 Volts</option>
        <option value="110 Volts">110 Volts</option>
      </select>
      <select name="options[Size]" data-product-form-option="" data-index="option3">
        <option value="Small" selected="selected">Small</option>
        <option value="Large">Large</option>
      </select>
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

  test('assigns the options object which is passed as the third argument to .options', () => {
    const element = document.getElementById('form');
    const options = {onOptionChange: jest.fn()};
    const productForm = new ProductForm(element, productJSON, options);

    expect(productForm.options).toBe(options);
  });

  test('assigns all option inputs to .optionsInputs', () => {});
});
