var SECTION_ID_ATTR = 'data-section-id';

export default function Section(container, properties) {
  this.container = validateContainerElement(container);
  this.id = container.getAttribute(SECTION_ID_ATTR);
  this.extensions = [];

  assign(this, validatePropertiesObject(properties));

  if (window.Shopify.designMode) {
    this._onUnload = this._onUnload.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onDeselect = this._onDeselect.bind(this);
    this._onBlockSelect = this._onBlockSelect.bind(this);
    this._onBlockDeselect = this._onBlockDeselect.bind(this);

    document.addEventListener('shopify:section:unload', this._onUnload);
    document.addEventListener('shopify:section:select', this._onSelect);
    document.addEventListener('shopify:section:deselect', this._onDeselect);
    document.addEventListener('shopify:block:select', this._onBlockSelect);
    document.addEventListener('shopify:block:deselect', this._onBlockDeselect);
  }

  this.onLoad();
}

Section.prototype = {
  onLoad: function onLoad() {},
  onUnload: function onUnload() {},
  onSelect: function onSelect() {},
  onDeselect: function onDeselect() {},
  onBlockSelect: function onBlockSelect() {},
  onBlockDeselect: function onBlockDeselect() {},

  unload: function() {
    this.onUnload();

    if (window.Shopify.designMode) {
      document.removeEventListener('shopify:section:unload', this._onUnload);
      document.removeEventListener('shopify:section:select', this._onSelect);
      document.removeEventListener(
        'shopify:section:deselect',
        this._onDeselect
      );
      document.removeEventListener('shopify:block:select', this._onBlockSelect);
      document.removeEventListener(
        'shopify:block:deselect',
        this._onBlockDeselect
      );
    }
  },

  extend: function extend(extension) {
    this.extensions.push(extension); // Save original extension

    var extensionClone = assign({}, extension);
    delete extensionClone.init; // Remove init function before assigning extension properties
    assign(this, extensionClone);

    if (typeof extension.init === 'function') {
      extension.init.apply(this);
    }
  },

  _onUnload: function _onUnload(event) {
    if (this.id !== event.detail.sectionId) {
      return;
    }

    this.unload();
  },

  _onSelect: function _onSelect(event) {
    this.id === event.detail.sectionId && this.onSelect(event.detail.load);
  },

  _onDeselect: function _onDeselect(event) {
    this.id === event.detail.sectionId && this.onDeselect();
  },

  _onBlockSelect: function _onBlockSelect(event) {
    this.id === event.detail.sectionId &&
      this.onBlockSelect(event.detail.blockId, event.detail.load);
  },

  _onBlockDeselect: function _onBlockDeselect(event) {
    this.id === event.detail.sectionId &&
      this.onBlockDeselect(event.detail.blockId);
  }
};

function validateContainerElement(container) {
  if (!(container instanceof Element)) {
    throw new TypeError(
      'Theme Sections: Attempted to load section. The section container provided is not a DOM element.'
    );
  }
  if (container.getAttribute(SECTION_ID_ATTR) === null) {
    throw new Error(
      'Theme Sections: The section container provided does not have an id assigned to the ' +
        SECTION_ID_ATTR +
        ' attribute.'
    );
  }

  return container;
}

function validatePropertiesObject(value) {
  if (
    (typeof value !== 'undefined' && typeof value !== 'object') ||
    value === null
  ) {
    throw new TypeError(
      'Theme Sections: The properties object provided is not a valid'
    );
  }

  return value;
}

// Object.assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
function assign(target, varArgs) {
  // .length of function is 2
  'use strict';
  if (target == null) {
    // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var to = Object(target);

  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource != null) {
      // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}
