/**
 * @jest-environment jsdom
 */

import Listeners from '../listeners';

describe('Listeners()', () => {
  test('is a constructor', () => {
    const listeners = new Listeners();

    expect(listeners).toBeInstanceOf(Listeners);
  });
});

describe('Listeners.add()', () => {
  test('add an event listener to the designated element', () => {
    document.body.innerHTML = '<button>A Button</button>';

    const element = document.querySelector('button');
    const listeners = new Listeners();
    const listener = jest.fn();

    listeners.add(element, 'click', listener);

    element.click();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('adds the listener to Listeners.entries', () => {
    document.body.innerHTML = '<button>A Button</button>';

    const element = document.querySelector('button');
    const listeners = new Listeners();
    const listener = jest.fn();

    listeners.add(element, 'click', listener);

    expect(listeners.entries[0]).toMatchObject({fn: listener});
  });
});

describe('Listeners.removeAll()', () => {
  test('removes all event listeners that have been added', () => {
    document.body.innerHTML = '<button>A Button</button>';

    const element = document.querySelector('button');
    const listeners = new Listeners();
    const listener = jest.fn();

    listeners.add(element, 'click', listener);
    element.click();
    expect(listener).toHaveBeenCalledTimes(1);

    listeners.removeAll();
    element.click();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listeners.entries.length).toBe(0);
  });
});
