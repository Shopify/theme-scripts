require('isomorphic-fetch');

const fetchMock = require('fetch-mock');
const cart = require('../theme-cart');
const populatedState = require('../__fixtures__/cart-populated.json');

// For now, we need these settings to ensure Fetch works correctly with Shopify Cart API
// https://github.com/Shopify/shopify/issues/94144
const fetchAPISettings = {
  credentials: 'same-origin',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;'
  }
};

function mockCartChange(url, options) {
  const body = JSON.parse(options.body);
  const line = body.line;
  const item = populatedState.items[line - 1];

  item.quantity = body.quantity || item.quantity;
  item.properties = body.properties || item.properties;

  // Simulate /cart/change.js not throwing error when quantity is unavailable
  // but it still sets it to the max available quantity
  if (body.quantity > 9) {
    item.quantity = 9;
  }

  return populatedState;
}

function mockCartAdd(url, options) {
  const body = JSON.parse(options.body);

  // Simulate /cart/add.js 422 error object when request quantity is unavailable
  if (typeof body.quantity !== 'undefined' && body.quantity > 9) {
    // eslint-disable-next-line no-throw-literal
    throw {status: 422};
  }

  return populatedState.items[0];
}

describe('getState()', () => {
  const body = require('../__fixtures__/cart-empty.json');

  beforeEach(() => {
    fetchMock.mock('/cart.js', {body});
  });

  afterEach(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.getState().then).toBeDefined();
  });

  test('fulfills with the state object of the cart', async () => {
    const spy = jest.spyOn(global, 'fetch');

    const state = await cart.getState();

    expect(state).toMatchObject(body);
    expect(spy).toHaveBeenLastCalledWith(
      '/cart.js',
      expect.objectContaining(fetchAPISettings)
    );
  });
});

describe('getItemIndex()', () => {
  const body = require('../__fixtures__/cart-populated.json');

  beforeEach(() => {
    fetchMock.mock('/cart.js', {body});
  });

  afterEach(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.getItemIndex('123456:123456').then).toBeDefined();
  });

  test('rejects if first argument is not a line item key', () => {
    expect(() => cart.getItemIndex()).toThrowError(TypeError);
    expect(() => cart.getItemIndex(123456)).toThrowError(TypeError);
    expect(() => cart.getItemIndex('123456')).toThrowError(TypeError);
  });

  test('rejects if line item is not found', async () => {
    await expect(cart.getItemIndex('not:found')).rejects.toThrowError();
  });

  test('fulfills with the line item index (base 1) if found', async () => {
    const index = 0;
    const key = body.items[index].key;

    await expect(cart.getItemIndex(key)).resolves.toBe(index + 1);
  });
});

describe('getItem()', () => {
  const body = require('../__fixtures__/cart-populated.json');

  beforeEach(() => {
    fetchMock.mock('/cart.js', {body});
  });

  afterEach(fetchMock.restore);

  test('throws an error if first argument is not a line item key', () => {
    expect(() => cart.getItem()).toThrowError(TypeError);
    expect(() => cart.getItem(123456)).toThrowError(TypeError);
    expect(() => cart.getItem('123456')).toThrowError(TypeError);
  });

  test('returns a promise', () => {
    expect(cart.getItem('123456:123456').then).toBeDefined();
  });

  test('fulfills with line item object if a match is found', async () => {
    const key = body.items[0].key;
    await expect(cart.getItem(key)).resolves.toMatchObject(body.items[0]);
  });

  test('rejects if line item is not found', async () => {
    await expect(cart.getItem('noMatch:something')).rejects.toThrowError();
  });
});

describe('addItem()', () => {
  beforeEach(() => {
    fetchMock.mock('/cart/add.js', mockCartAdd);
  });

  afterEach(fetchMock.restore);

  test('throws an error if first argument is not a variantId number', () => {
    expect(() => cart.addItem(123456)).not.toThrowError();
    expect(() => cart.addItem()).toThrowError(TypeError);
    expect(() => cart.addItem('123456:123456')).toThrowError(TypeError);
    expect(() => cart.addItem('123456')).toThrowError(TypeError);
  });

  test('optional second argument is an object with a `quantity` key', async () => {
    const spy = jest.spyOn(global, 'fetch');
    const item = require('../__fixtures__/cart-populated.json').items[0];
    const id = item.id;
    const quantity = 3;
    const options = {quantity};

    await cart.addItem(id, options);

    expect(spy).toHaveBeenLastCalledWith(
      '/cart/add.js',
      expect.objectContaining({body: JSON.stringify({id, ...options})})
    );
  });

  test('optional second argument is an object with a `properties` key', async () => {
    const spy = jest.spyOn(global, 'fetch');
    const item = require('../__fixtures__/cart-populated.json').items[0];
    const id = item.id;
    const properties = {
      someKey: 'someValue'
    };
    const options = {properties};

    await cart.addItem(id, options);

    expect(spy).toHaveBeenLastCalledWith(
      '/cart/add.js',
      expect.objectContaining({body: JSON.stringify({id, ...options})})
    );
  });

  test('returns a promise', () => {
    expect(cart.addItem(123456).then).toBeDefined();
  });

  test('fulfills with the line item which was added to the cart', async () => {
    const item = require('../__fixtures__/cart-populated.json').items[0];
    const id = item.id;

    await expect(cart.addItem(id)).resolves.toMatchObject(item);
  });
});

describe('updateItem()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart.js', populatedState);
    fetchMock.mock('/cart/change.js', mockCartChange);
  });

  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(
      cart.updateItem(populatedState.items[0].key, {quantity: 2}).then
    ).toBeDefined();
  });

  test('throws error if first argument is not a line item key', () => {
    expect(() => cart.updateItem(123456, {quantity: 2})).toThrowError();
    expect(() => cart.updateItem('123456', {quantity: 2})).toThrowError();
  });

  test('throws error if the second argument is not an object containing quantity key/value or properties key/value', () => {
    expect(() => cart.updateItem('123456:123456')).toThrowError(TypeError);
    expect(() => cart.updateItem('123456:123456', {})).toThrowError(Error);
    expect(() =>
      cart.updateItem('123456:123456', {quantity: 2})
    ).not.toThrowError();
    expect(() =>
      cart.updateItem('123456:123456', {properties: {}})
    ).not.toThrowError();
  });

  test('fulfills with the cart state object', async () => {
    const item = require('../__fixtures__/cart-populated.json').items[0];
    const quantity = 2;
    await expect(
      cart.updateItem(item.key, {quantity})
    ).resolves.toMatchObject(populatedState);
  });

  test('makes a request to the `cart/change.js` endpoint using the line number as an identifier', async () => {
    const spyFetch = jest.spyOn(global, 'fetch');
    const item = require('../__fixtures__/cart-populated.json').items[0];

    await cart.updateItem(item.key, {quantity: 2});

    expect(spyFetch).toHaveBeenLastCalledWith(
      '/cart/change.js',
      expect.objectContaining({
        body: JSON.stringify({line: 1, quantity: 2})
      })
    );
  });
});

describe('removeItem()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart.js', populatedState);
    fetchMock.mock('/cart/change.js', mockCartChange);
  });

  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(
      cart.removeItem(populatedState.items[0].key, {
        properties: {someKey: 'someValue'}
      }).then
    ).toBeDefined();
  });

  test('rejects if first argument is not a line item key', async () => {
    await expect(() => cart.removeItem(123456)).toThrowError(TypeError);
    await expect(() => cart.removeItem('123456')).toThrowError(TypeError);
  });

  test('fulfills with the updated cart state', async () => {
    const item = require('../__fixtures__/cart-populated.json').items[0];
    await expect(cart.removeItem(item.key)).resolves.toMatchObject(
      populatedState
    );
  });

  test('makes a request to the `cart/change.js` endpoint using the line number as an identifier', async () => {
    const spyFetch = jest.spyOn(global, 'fetch');
    const item = require('../__fixtures__/cart-populated.json').items[0];

    await cart.removeItem(item.key);

    expect(spyFetch).toHaveBeenLastCalledWith(
      '/cart/change.js',
      expect.objectContaining({
        body: JSON.stringify({line: 1, quantity: 0})
      })
    );
  });
});

describe('clearItems()', () => {
  const body = require('../__fixtures__/cart-empty.json');

  beforeEach(() => {
    fetchMock.mock('/cart/clear.js', {body});
  });

  afterEach(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.clearItems().then).toBeDefined();
  });

  test('clears the line items from the cart state object', async () => {
    const spy = jest.spyOn(global, 'fetch');

    await cart.clearItems();

    expect(spy).toHaveBeenLastCalledWith(
      '/cart/clear.js',
      expect.objectContaining(fetchAPISettings)
    );
  });

  test('resolves with the state object of the cart', async () => {
    const state = await cart.clearItems();
    expect(state).toMatchObject(body);
  });
});

describe('getAttributes()', () => {
  beforeEach(() => {
    fetchMock.mock('/cart.js', {body: populatedState});
  });

  afterEach(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.getAttributes().then).toBeDefined();
  });

  test('fulfills with the attributes object of the cart state object', () => {
    expect(cart.getAttributes()).resolves.toMatchObject(
      populatedState.attributes
    );
  });
});

describe('updateAttributes()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart/update.js', (url, options) => {
      const body = JSON.parse(options.body);
      return Object.assign(populatedState, {
        attributes: body.attributes
      });
    });
  });

  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.updateAttributes).toBeDefined();
    expect(cart.updateAttributes().then).toBeDefined();
  });

  test('fulfills with the cart state object', async () => {
    const attributes = {someKey: 'someValue'};
    const returned = await cart.updateAttributes(attributes);

    expect(returned).toMatchObject(populatedState);
    expect(returned.attributes).toMatchObject(attributes);
  });
});

describe('clearAttributes()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart/update.js', (url, options) => {
      const body = JSON.parse(options.body);
      return Object.assign(populatedState, {
        attributes: body.attributes
      });
    });
    fetchMock.mock('/cart.js', {body: populatedState});
  });

  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.clearAttributes).toBeDefined();
    expect(cart.clearAttributes().then).toBeDefined();
  });

  test('fulfills with the cart state object', async () => {
    await expect(cart.clearAttributes()).resolves.toMatchObject(populatedState);
  });
});

describe('getNote()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart.js', {body: populatedState});
  });

  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.getNote).toBeDefined();
    expect(cart.getNote().then).toBeDefined();
  });
  test('resolves with the note value', async () => {
    await expect(cart.getNote()).resolves.toBe(populatedState.note);
  });
});

describe('updateNote()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart/update.js', () => (url, options) => {
      const body = JSON.parse(options.body);
      return Object.assign(populatedState, {note: body.note});
    });
  });

  afterAll(fetchMock.restore);
  test('returns a promise', () => {
    expect(cart.updateNote).toBeDefined();
    expect(cart.updateNote('').then).toBeDefined();
  });

  test('resolves with the cart state object', async () => {
    const value = 'New note value';
    await expect(cart.updateNote(value)).resolves.toMatchObject(
      Object.assign(populatedState, {note: value})
    );
  });
});

describe('clearNote()', () => {
  beforeAll(() => {
    fetchMock.mock('/cart/update.js', () => (url, options) => {
      const body = JSON.parse(options.body);
      return Object.assign(populatedState, {note: body.note});
    });
  });
  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.clearNote).toBeDefined();
    expect(cart.clearNote().then).toBeDefined();
  });

  test('resolves with the cleared note value in the cart state object', async () => {
    await expect(cart.clearNote()).resolves.toMatchObject(
      Object.assign(populatedState, {note: ''})
    );
  });
});

describe('getShippingRates()', () => {
  const shippingRates = require('../__fixtures__/shipping-rates.json');

  beforeAll(() => {
    fetchMock.mock('/cart/shipping_rates.json', shippingRates);
  });
  afterAll(fetchMock.restore);

  test('returns a promise', () => {
    expect(cart.getShippingRates).toBeDefined();
    expect(cart.getShippingRates().then).toBeDefined();
  });

  test('resolves with an array of shipping rate objects', () => {
    expect(cart.getShippingRates()).resolves.toMatchObject(shippingRates);
  });
});
