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
  getInstances
} from './theme-sections';

import Section from './section';

function registerSections() {
  document.body.innerHTML = `
      <div id="section1" class="class1" data-section-id="1" data-section-type="type1"></div>
      <div id="section2" class="class1" data-section-id="2" data-section-type="type1"></div>
      <div id="section3" class="class2" data-section-id="3" data-section-type="type2"></div>
      <div id="section4" class="class2" data-section-id="4" data-section-type="type3"></div>
      <div id="invalidSection1" class="class2"></div>
    `;

  register('type1');
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
    var type = 'slideshow';
    var properties = { newValue: 'some-value' };

    var TypedSection = register(type, properties);
    var instance = new TypedSection(container);

    expect(typeof TypedSection).toBe('function');
    expect(TypedSection.constructor.prototype).toMatchObject(Section.prototype);
    expect(TypedSection.prototype.type).toBe(type);
    expect(instance.newValue).toBe('some-value');
  });

  test('adds a new section type to the global registered sections object ', () => {
    var type = 'slideshow';
    var properties = { newValue: 'some-value' };

    var TypedSection = register(type, properties);

    expect(registered[type]).toBe(TypedSection);
  });

  test('adds the section type to the prototype of the new Section constructor', () => {
    var type = 'slideshow';

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
    expect(typeof registered['type1']).toBe('undefined');
    expect(typeof registered['type2']).toBe('undefined');
    expect(typeof registered['type3']).toBe('undefined');
  });

  test('can unregister an array of registered section types in the document', () => {
    unregister(['type1', 'type2']);
    expect(typeof registered['type1']).toBe('undefined');
    expect(typeof registered['type2']).toBe('undefined');
    expect(typeof registered['type3']).not.toBe('undefined');
  });

  test('can unregister a single registered section type in the document', () => {
    unregister('type1');
    expect(typeof registered['type1']).toBe('undefined');
    expect(typeof registered['type2']).not.toBe('undefined');
    expect(typeof registered['type3']).not.toBe('undefined');
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
    var extension = { someKey: 'someValue' };

    extend('*', extension);

    instances.forEach(instance => {
      expect(instance.someKey).toBe('someValue');
    });
  });

  test('applies an extension to section instances with types that match the provided array of types', () => {
    var extension = { someKey: 'someValue' };
    extend(['type1', 'type2'], extension);

    var instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(3);
  });

  test('applies an extension to section instances which match a single type', () => {
    var extension = { someKey: 'someValue' };
    extend('type1', extension);

    var instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(2);
  });

  test('applies an extension to section instances which match a single container element', () => {
    var extension = { someKey: 'someValue' };
    var container = document.querySelector('#section1');
    extend(container, extension);

    var instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(1);
  });

  test('applies an extension to section instances which match a Nodelist of container elements', () => {
    var extension = { someKey: 'someValue' };
    var containers = document.querySelectorAll('.class1');
    extend(containers, extension);

    var instancesWithExtension = instances.filter(
      instance => instance.someKey === 'someValue'
    );

    expect(instancesWithExtension.length).toBe(2);
  });

  test('applies an extension to section instances which match an array of container elements', () => {
    var extension = { someKey: 'someValue' };
    var containers = [
      document.querySelector('#section1'),
      document.querySelector('#section2')
    ];
    extend(containers, extension);

    var instancesWithExtension = instances.filter(
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
    var instances = getInstances('*');
    expect(instances.length).toBe(4);
  });
  test('retrieves all section instances which match a single type', () => {
    var instances = getInstances('type3');
    expect(instances.length).toBe(1);
  });
  test('retrieves all section instances which match an array of types', () => {
    var instances = getInstances(['type1', 'type2']);
    expect(instances.length).toBe(3);
  });
  test('retrieves all section instances which match a single container element', () => {
    var instances = getInstances(document.querySelector('#section1'));
    expect(instances.length).toBe(1);
  });
  test('retrieves all section instances which match a Nodelist of container elements', () => {
    var instances = getInstances(document.querySelectorAll('.class1'));
    expect(instances.length).toBe(2);
  });
  test('retrieves all section instances which match an array of container elements', () => {
    var instances = getInstances([
      document.querySelector('#section1'),
      document.querySelector('#section2')
    ]);
    expect(instances.length).toBe(2);
  });
});
