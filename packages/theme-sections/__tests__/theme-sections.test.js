/**
 * @jest-environment jsdom
 */

import {
  register,
  registered,
  unregister,
  instances,
  load,
  unload,
  extend,
  getInstances,
  getInstanceById
} from '../theme-sections';

import Section from '../section';

function registerSections() {
  document.body.innerHTML = `
      <div id="shopify-section-1" class="shopify-section">
        <div id="section1" class="class1" data-section-id="1" data-section-type="type1"></div>
      </div>
      <div id="shopify-section-2" class="shopify-section">
        <div id="section2" class="class1" data-section-id="2" data-section-type="type1"></div>
      </div>
      <div id="shopify-section-3" class="shopify-section">
        <div id="section3" class="class2" data-section-id="3" data-section-type="type2"></div>
      </div>
      <div id="shopify-section-4" class="shopify-section">
        <div id="section4" class="class2" data-section-id="4" data-section-type="type3"></div>
      </div>
      <div id="shopify-section-12345" class="shopify-section">
        <div id="invalidSection1" class="class2"></div>
      </div>
    `;

  register('type1', {
    onLoad: jest.fn(),
    onUnload: jest.fn(),
    onSelect: jest.fn(),
    onDeselect: jest.fn(),
    onBlockSelect: jest.fn(),
    onBlockDeselect: jest.fn()
  });
  register('type2');
  register('type3');
}

beforeEach(() => {
  unload('*');
  unregister('*');
  jest.resetAllMocks();
});

describe('registered', () => {
  test('is an global object used to store types of sections', () => {
    expect(typeof registered).toBe('object');
  });
});

describe('register()', () => {
  test('returns a subclass of the Section constructor', () => {
    document.body.innerHTML = `
      <section id="section1" data-section-id="123456" data-section-type="type1"></section>
    `;

    const container = document.querySelector('#section1');
    const type = 'slideshow';
    const properties = {newValue: 'some-value'};

    const TypedSection = register(type, properties);
    const instance = new TypedSection(container);

    expect(typeof TypedSection).toBe('function');
    expect(TypedSection.constructor.prototype).toMatchObject(Section.prototype);
    expect(TypedSection.prototype.type).toBe(type);
    expect(instance.newValue).toBe('some-value');
  });

  test('adds a new section type to the global registered sections object ', () => {
    const type = 'slideshow';
    const properties = {newValue: 'some-value'};

    const TypedSection = register(type, properties);

    expect(registered[type]).toBe(TypedSection);
  });

  test('adds the section type to the prototype of the new Section constructor', () => {
    const type = 'slideshow';

    register(type);
    expect(registered[type].prototype.type).toBe(type);
  });

  test('throws an error if first arugment is not a string', () => {
    expect(() => register('slideshow')).not.toThrowError(TypeError);
    expect(() => register(123)).toThrowError(TypeError);
    expect(() => register({})).toThrowError(TypeError);
    expect(() => register(null)).toThrowError(TypeError);
    expect(() => register()).toThrowError(TypeError);
  });

  test('throws an error if called with the same first argument more than once', () => {
    expect(() => register('slideshow')).not.toThrowError();
    expect(() => register('slideshow')).toThrowError();
  });
});

describe('.unregister()', () => {
  beforeEach(() => {
    register('type1');
    register('type2');
    register('type3');
  });

  test('can unregister all registered section types in the document', () => {
    unregister('*');
    expect(typeof registered.type1).toBe('undefined');
    expect(typeof registered.type2).toBe('undefined');
    expect(typeof registered.type3).toBe('undefined');
  });

  test('can unregister an array of registered section types in the document', () => {
    unregister(['type1', 'type2']);
    expect(typeof registered.type1).toBe('undefined');
    expect(typeof registered.type2).toBe('undefined');
    expect(typeof registered.type3).not.toBe('undefined');
  });

  test('can unregister a single registered section type in the document', () => {
    unregister('type1');
    expect(typeof registered.type1).toBe('undefined');
    expect(typeof registered.type2).not.toBe('undefined');
    expect(typeof registered.type3).not.toBe('undefined');
  });
});

describe('instances', () => {
  test('is a global array used to store instances of sections', () => {
    expect(Array.isArray(instances)).toBeTruthy();
  });
});

describe('load()', () => {
  beforeEach(registerSections);

  test('does nothing if invalid type or container or combination of type/container is provided', () => {
    load('*', document.querySelector('#invalidSection1'));
    load('*', document.querySelector('#doesNotExist'));
    load('type1', document.querySelector('.class2'));
    load('unregisteredType', document.querySelector('.class3'));
    expect(instances.length).toBe(0);
  });

  test('can load all registered section types in the document', () => {
    load('*');
    expect(instances.length).toBe(4);
  });

  test('can load an array of registered section type strings', () => {
    load(['type1', 'type2']);
    expect(instances.length).toBe(3);
  });

  test('can load a single registered section type string', () => {
    load('type1');
    expect(instances.length).toBe(2);
  });

  test('can load an array of registered section constructors', () => {
    unregister('*');

    const Type1 = register('type1');
    const Type2 = register('type2');
    const Type3 = register('type3');

    load([Type1, Type2, Type3]);

    expect(instances.length).toBe(4);
  });

  test('can load a single registered section constructor', () => {
    unregister('*');

    const Type1 = register('type1');

    load(Type1);

    expect(instances.length).toBe(2);
  });

  test('can load all registered sections types found in Nodelist', () => {
    const containers = document.querySelectorAll('.class1');
    load('*', containers);
    expect(instances.length).toBe(2);
  });

  test('loads all registered sections types found in an array of elements', () => {
    const containers = [
      document.querySelector('.class1'),
      document.querySelector('.class2')
    ];
    load('*', containers);
    expect(instances.length).toBe(2);
  });

  test('loads the registered section found in the single provided DOM element', () => {
    load('*', document.querySelector('.class2'));
    load('type1', document.querySelector('.class1'));

    expect(instances.length).toBe(2);
  });

  test('only loads elements with data-section-type attribute', () => {
    load('*', document.querySelector('.class2'));
    load('*', document.querySelector('#invalidSection1'));

    expect(instances.length).toBe(1);
  });

  test('will not load a container that has already been loaded', () => {
    load('*', document.querySelector('.class2'));
    expect(instances.length).toBe(1);
    load('*', document.querySelector('.class2'));
    expect(instances.length).toBe(1);
  });
});

describe('unload()', () => {
  beforeEach(() => {
    registerSections();
    load('*');
  });

  test('unloads all section instances', () => {
    unload('*');
    expect(instances.length).toBe(0);
  });

  test('unloads all section instances that match an array of section types', () => {
    unload(['type1', 'type2']);
    expect(instances.length).toBe(1);
  });

  test('unloads all sections instances of a single type', () => {
    unload('type1');
    expect(instances.length).toBe(2);
  });

  test('unloads section instances which match a Nodelist of container elements', () => {
    const containers = document.querySelectorAll('.class1');
    unload(containers);
    expect(instances.length).toBe(2);
  });

  test('unloads section instances which match an array of matching container elements', () => {
    const containers = [
      document.querySelector('.class1'),
      document.querySelector('.class2')
    ];
    unload(containers);
    expect(instances.length).toBe(2);
  });

  test('unloads a section instance which matches a single provided container element', () => {
    unload(document.querySelector('.class1'));
    expect(instances.length).toBe(3);
  });
});

describe('.extend()', () => {
  beforeEach(() => {
    registerSections();
    load('*');
  });

  test('applies an extension to all section instances on the page', () => {
    const extension = {someKey: 'someValue'};

    extend('*', extension);

    instances.forEach(instance => {
      expect(instance.someKey).toBe('someValue');
    });
  });

  test('applies an extension to section instances with types that match the provided array of types', () => {
    const extension = {someKey: 'someValue'};
    extend(['type1', 'type2'], extension);

    const instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(3);
  });

  test('applies an extension to section instances which match a single type', () => {
    const extension = {someKey: 'someValue'};
    extend('type1', extension);

    const instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(2);
  });

  test('applies an extension to section instances which match a single container element', () => {
    const extension = {someKey: 'someValue'};
    const container = document.querySelector('#section1');
    extend(container, extension);

    const instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(1);
  });

  test('applies an extension to section instances which match a Nodelist of container elements', () => {
    const extension = {someKey: 'someValue'};
    const containers = document.querySelectorAll('.class1');
    extend(containers, extension);

    const instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(2);
  });

  test('applies an extension to section instances which match an array of container elements', () => {
    const extension = {someKey: 'someValue'};
    const containers = [
      document.querySelector('#section1'),
      document.querySelector('#section2')
    ];
    extend(containers, extension);

    const instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(2);
  });
});

describe('getInstances()', () => {
  beforeEach(() => {
    registerSections();
    load('*');
  });

  test('retrieves all section instances when passed "*"', () => {
    expect(getInstances('*').length).toBe(4);
  });
  test('retrieves all section instances which match a single type', () => {
    expect(getInstances('type3').length).toBe(1);
  });
  test('retrieves all section instances which match an array of types', () => {
    expect(getInstances(['type1', 'type2']).length).toBe(3);
  });
  test('retrieves all section instances which match a single container element', () => {
    expect(getInstances(document.querySelector('#section1')).length).toBe(1);
  });
  test('retrieves all section instances which match a Nodelist of container elements', () => {
    expect(getInstances(document.querySelectorAll('.class1')).length).toBe(2);
  });
  test('retrieves all section instances which match an array of container elements', () => {
    expect(
      getInstances([
        document.querySelector('#section1'),
        document.querySelector('#section2')
      ]).length
    ).toBe(2);
  });
});

describe('getInstanceById()', () => {
  beforeEach(() => {
    registerSections();
    load('*');
  });

  test('retrieves section instance which matches provided id', () => {
    const instance = getInstanceById('2');
    expect(instance).not.toBeUndefined();
    expect(instance.id).toBe('2');
  });
});

describe('adds event handlers to the document when Shopify.designMode === true, which', () => {
  beforeAll(() => {
    // Set designmode to true
    window.Shopify.designMode = true;

    // Reload theme-sections script so its loaded with designMode=true
    jest.resetModules();
    require('../theme-sections');
  });
  beforeEach(() => {
    registerSections();
  });

  test('loads a new section instance when shopify:section:load event is fired', done => {
    const validWrapper = document.getElementById('shopify-section-1');
    const invalidWrapper = document.getElementById('shopify-section-12345');

    const validEvent = new CustomEvent('shopify:section:load', {
      bubbles: true,
      detail: {sectionId: '1'}
    });

    const invalidEvent = new CustomEvent('shopify:section:load', {
      bubbles: true,
      detail: {sectionId: '12345'}
    });

    // This event listener should always fire after the one we are testing
    document.addEventListener('shopify:section:load', () => {
      expect(instances.length).toBe(1);
      expect(instances[0].onLoad).toHaveBeenCalledTimes(1);
      done();
    });

    validWrapper.dispatchEvent(validEvent);
    invalidWrapper.dispatchEvent(invalidEvent);
  });

  test('unloads a section when shopify:section:unload event is fired', done => {
    const wrapper = document.getElementById('shopify-section-1');
    const event = new CustomEvent('shopify:section:unload', {
      bubbles: true,
      detail: {sectionId: '1'}
    });

    load('type1');

    expect(instances.length).toBe(2);

    document.addEventListener('shopify:section:unload', () => {
      expect(instances.length).toBe(1);
      expect(instances[0].onUnload).toHaveBeenCalledTimes(1);
      done();
    });

    wrapper.dispatchEvent(event);
  });

  test('calls the onSelect method of a section when shopify:section:select event is fired', done => {
    const wrapper = document.getElementById('shopify-section-1');
    const event = new CustomEvent('shopify:section:select', {
      bubbles: true,
      detail: {sectionId: '1', load: true}
    });

    load('type1');

    document.addEventListener('shopify:section:select', () => {
      expect(instances[0].onSelect).toHaveBeenCalledTimes(1);
      expect(instances[0].onSelect).toHaveBeenLastCalledWith(event);
      done();
    });

    wrapper.dispatchEvent(event);
  });

  test('calls the onDeselect method of a section when shopify:section:deselect event is fired', done => {
    const wrapper = document.getElementById('shopify-section-1');
    const event = new CustomEvent('shopify:section:deselect', {
      bubbles: true,
      detail: {sectionId: '1'}
    });

    load('type1');

    document.addEventListener('shopify:section:deselect', () => {
      expect(instances[0].onDeselect).toHaveBeenCalledTimes(1);
      expect(instances[0].onDeselect).toHaveBeenLastCalledWith(event);
      done();
    });

    wrapper.dispatchEvent(event);
  });

  test('calls the onBlockSelect method of a section when shopify:section:select event is fired', done => {
    const wrapper = document.getElementById('shopify-section-1');
    const event = new CustomEvent('shopify:block:select', {
      bubbles: true,
      detail: {sectionId: '1', load: true, blockId: '13'}
    });

    load('type1');

    document.addEventListener('shopify:block:select', () => {
      expect(instances[0].onBlockSelect).toHaveBeenCalledTimes(1);
      expect(instances[0].onBlockSelect).toHaveBeenLastCalledWith(event);
      done();
    });

    wrapper.dispatchEvent(event);
  });

  test('calls the onBlockDeselect method of a section when shopify:section:select event is fired', done => {
    const wrapper = document.getElementById('shopify-section-1');
    const event = new CustomEvent('shopify:block:deselect', {
      bubbles: true,
      detail: {sectionId: '1', load: true, blockId: '13'}
    });

    load('type1');

    document.addEventListener('shopify:block:deselect', () => {
      expect(instances[0].onBlockDeselect).toHaveBeenCalledTimes(1);
      expect(instances[0].onBlockDeselect).toHaveBeenLastCalledWith(event);
      done();
    });

    wrapper.dispatchEvent(event);
  });
});
