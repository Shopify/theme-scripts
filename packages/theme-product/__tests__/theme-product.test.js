/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import {
  getUrlWithVariant,
  getVariantFromId,
  getVariantFromSerializedArray,
  getVariantFromOptionArray
} from '../theme-product';
import productJson from '../__fixtures__/product.json';

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
      getVariantFromId(productJson, '6908023078979');
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
    const myRandomObj = [
      {
        property: 'my value',
        random: 'another value'
      },
      {
        property: 'my value',
        random: 'another value'
      }
    ];

    const myInvalidObj = [
      {
        name: 9497490,
        random: 'another value'
      },
      {
        name: 34324,
        random: 'another value'
      }
    ];

    expect(() => {
      getVariantFromSerializedArray(productJson, []);
    }).toThrow();

    expect(() => {
      getVariantFromSerializedArray(productJson, 'color');
    }).toThrow('color is not an array.');

    expect(() => {
      getVariantFromSerializedArray(productJson, ['shoes']);
    }).toThrow();

    expect(() => {
      getVariantFromSerializedArray(productJson, myRandomObj);
    }).toThrow();

    expect(() => {
      getVariantFromSerializedArray(productJson, myInvalidObj);
    }).toThrow(
      `Invalid value type passed for name of option ${
        myInvalidObj[0].name
      }. Value should be string.`
    );
  });

  test('returns a product variant object when a match is found', () => {
    document.body.innerHTML = `<form>
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
    document.body.innerHTML = `<form>
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
