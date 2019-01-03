/**
 * @jest-environment jsdom
 */

import ProductForm from '../theme-product-form';
import productJSON from '../__fixtures__/product-object.json';

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

              <option value="110 Volts">
                  110 Volts
              </option>

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
