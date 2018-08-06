/**
 * @jest-environment jsdom
 */
import {
  getVariantFromId,
  getVariantFromSerializedArray,
  getVariantFromOptionArray
} from './theme-product';
import $ from 'jquery';
import productJson from './__fixtures__/product.json';

describe('getVariantFromId()', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof getVariantFromId).toBe('function');
  });

  test('throws an error if first argument is not a valid product object', () => {
    expect(() => {
      getVariantFromId();
    }).toThrow();

    expect(() => {
      getVariantFromId({});
    }).toThrow();

    expect(() => {
      getVariantFromId(null, {});
    }).toThrow();
  });

  test('throws an error if second argument is not a valid product ID', () => {
    expect(() => {
      getVariantFromId({}, 6908023078973);
    }).toThrow();
  });

  test('returns a product variant object when a match is found', () => {
    const variant = getVariantFromId(productJson, 6908023078973);
    expect(variant).toEqual(productJson.variants[0]);
  });

  test('returns null when no match is found', () => {
    const variant = getVariantFromId(productJson, 6909083098073);
    expect(variant).toEqual(null);
  });
});

describe('getVariantFromSerializedArray()', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof getVariantFromSerializedArray).toBe('function');
  });

  test('throws an error if second argument is invalid', () => {
    expect(() => {
      getVariantFromSerializedArray(productJson, []);
    }).toThrow();

    expect(() => {
      getVariantFromSerializedArray(productJson, 'color');
    }).toThrow();

    expect(() => {
      getVariantFromSerializedArray(productJson, ['shoes']);
    }).toThrow();
  });

  test('returns a product variant object when a match is found', () => {
    document.body.innerHTML = `
    <form>
      <select id="Size" name="Size">
        <option value="35">35</option>
        <option value="36" selected>36</option>
        <option value="37">37</option>
      </select>

      <select id="Color" name="Color">
        <option value="Red">Red</option>
        <option value="Black" selected>Black</option>
      </select>
    </form>`;

    const variant = getVariantFromSerializedArray(
      productJson,
      $('form').serializeArray()
    );
    expect(variant).toEqual(productJson.variants[0]);
  });

  test('returns null when a match is not found', () => {
    document.body.innerHTML = `
    <form>
      <select id="Size" name="Size">
        <option value="8">8</option>
        <option value="10" selected>10</option>
        <option value="15">15</option>
      </select>

      <select id="Color" name="Color">
        <option value="Orange">Orange</option>
        <option value="Purple" selected>Purple</option>
        <option value="Green">Green</option>
      </select>
    </form>`;

    const variant = getVariantFromSerializedArray(
      productJson,
      $('form').serializeArray()
    );
    expect(variant).toEqual(null);
  });
});

describe('getVariantFromOptionArray()', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof getVariantFromOptionArray).toBe('function');
  });

  test('returns a product variant object when a match is found', () => {
    const arrayValues = ['38', 'Black'];
    const variant = getVariantFromOptionArray(productJson, arrayValues);
    expect(variant).toEqual(productJson.variants[2]);
  });

  test('returns null when a match is not found', () => {
    const arrayValues = ['45', 'Black'];

    const variant = getVariantFromOptionArray(productJson, arrayValues);
    expect(variant).toEqual(null);
  });
});
