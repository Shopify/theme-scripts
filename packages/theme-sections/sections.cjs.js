'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _omit = require('lodash-es/omit');

var _omit2 = _interopRequireDefault(_omit);

var _remove = require('lodash-es/remove');

var _remove2 = _interopRequireDefault(_remove);

var _find = require('lodash-es/find');

var _find2 = _interopRequireDefault(_find);

var _filter = require('lodash-es/filter');

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Sections() {
  var _this = this;

  this.$document = (0, _jquery2.default)(document);
  this.namespace = '.section-js-events';

  document.addEventListener('shopify:section:load', function (evt) {
    var id = evt.detail.sectionId;
    var container = evt.target.querySelector('[data-section-id="' + id + '"]');
    var type = container.getAttribute('data-section-type');

    _this.load(type, container);
  });
}

_jquery2.default.extend(Sections.prototype, {

  /**
   * Indexed list of all registered section types
   */
  registered: {},

  /**
   * List of all section instances
   */
  instances: [],

  /**
   * Indexed list of all registered global extensions
   */
  extensions: {
    '*': []
  },

  /**
   * Registers a section type with properties. Adds a new section constructor to
   * the registered list of sections.
   *
   * @param {string} type
   * @param {object} properties
   */
  register: function register(type, properties) {
    function Section(data) {
      this.type = type;
      Master.call(this, data);
    }

    Section.constructor = this.registered[type];
    Section.prototype = Object.create(Master.prototype);
    _jquery2.default.extend(Section.prototype, properties);

    this.registered[type] = Section;
  },


  /**
   * Loads all or the specified section types
   */
  load: function load(types, containers) {
    var _this2 = this;

    types = this._normalizeTypeParam(types);
    containers = this._normalizeContainersParam(containers);

    types.forEach(function (type) {
      var Section = _this2.registered[type];
      var selection = containers;

      if (typeof Section === 'undefined') {
        return;
      }

      if (typeof selection === 'undefined') {
        selection = document.querySelectorAll('[data-section-type="' + type + '"]');
      }

      // Convert selection NodeList into an array
      selection = Array.prototype.slice.call(selection);

      selection.forEach(function (container) {
        if (_this2._instanceExists(container)) {
          return;
        }

        var extensions = _this2.extensions['*'].concat(_this2.extensions[type] || []);
        var instance = new Section({
          container: container,
          extensions: extensions,
          id: container.getAttribute('data-section-id')
        });

        instance.trigger('section_load');

        _this2.instances.push(instance);
      });
    });
  },


  /**
   * Extend single, multiple, or all sections with additional functionality.
   */
  extend: function extend(types, extension) {
    var _this3 = this;

    types = this._normalizeTypeParam(types);

    types.forEach(function (type) {
      _this3.extensions[type] = _this3.extensions[type] || [];
      _this3.extensions[type].push(extension);

      if (typeof _this3.registered[type] === 'undefined') {
        return;
      }

      _this3.instances.forEach(function (instance) {
        if (instance.type !== type) {
          return;
        }
        instance.extend(extension);
      });
    });
  },


  /**
   * Checks if a particular section type has been loaded on the page.
   */
  isInstance: function isInstance(type) {
    return (0, _typeof3.default)((0, _find2.default)(this.instances, { type: type })) === 'object';
  },


  /**
   * Returns all instances of a section type on the page.
   */
  getInstances: function getInstances(type) {
    var _this4 = this;

    return _jquery2.default.Deferred(function (defer) {
      var instances = (0, _filter2.default)(_this4.instances, { type: type });

      if (instances.length === 0) {
        defer.reject();
      } else {
        defer.resolve(instances);
      }
    });
  },


  /**
   * Attaches an event handler to the document that is fired whenever any section
   * instance triggers an event of specified type. Automatically adds a namespace
   * for easy removal with `sections.off('event')`
   */
  on: function on() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$document.on.apply(this.$document, args);
  },


  /**
   * Removes an event handler attached using `sections.on()`.
   */
  off: function off() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$document.off.apply(this.$document, arguments);
  },


  /**
   * Triggers and event in every section instance
   */
  trigger: function trigger() {
    var triggerArgs = arguments;
    this.instances.forEach(function (instance) {
      instance.trigger.apply(instance, (0, _toConsumableArray3.default)(triggerArgs));
    });
  },
  _sectionTrigger: function _sectionTrigger() {
    this.$document.trigger.apply(this.$document, arguments);
  },
  _normalizeTypeParam: function _normalizeTypeParam(types) {
    if (types === '*') {
      types = Object.keys(this.registered);
    } else if (typeof types === 'string') {
      types = [types];
    }

    types = types.map(function (type) {
      return type.toLowerCase();
    });

    return types;
  },
  _normalizeContainersParam: function _normalizeContainersParam(containers) {
    if (!Array.isArray(containers) && (typeof containers === 'undefined' ? 'undefined' : (0, _typeof3.default)(containers)) === 'object') {
      // If a single container object is specified not inside a function
      containers = [containers];
    }
    return containers;
  },
  _instanceExists: function _instanceExists(container) {
    var instance = (0, _find2.default)(this.instances, {
      id: container.getAttribute('data-section-id')
    });
    return typeof instance !== 'undefined';
  }
});

var sections = new Sections();
exports.default = sections;

/**
 * Master section class that all sections inherit from
 * @constructor
 *
 */

function Master(data) {
  this.container = data.container;
  this.$container = (0, _jquery2.default)(this.container);
  this.id = data.id;
  this.namespace = '.' + data.id;
  this.extensions = data.extensions || [];
  this.$eventBinder = this.$container;

  _applyExtensions.call(this);
  _applyEditorHandlers.call(this);
  _applyDefaultHandlers.call(this);
}

Master.prototype = {
  /* eslint-disable no-empty-function */
  onLoad: function onLoad() {},
  onUnload: function onUnload() {},
  onSelect: function onSelect() {},
  onDeselect: function onDeselect() {},
  onBlockSelect: function onBlockSelect() {},
  onBlockDeselect: function onBlockDeselect() {},


  /* eslint-enable no-empty-function */

  /**
   * Attaches an event handler to an instance of a section. Only listens to
   * events triggered by that section instance.
   */
  on: function on() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.on.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },


  /**
   * Attaches an event handler to an instance of a section that is removed after
   * being called once. Only listens to events triggered by that section instance.
   */
  one: function one() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.one.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },


  /**
   * Removes an event handler that was attached using the `this.on()` method
   */
  off: function off() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Apply the section namespace to any event handler created by this section
    args[0] = args[0] || '';
    args[0] = args[0].concat(this.namespace);

    this.$eventBinder.off.apply(this.$eventBinder, arguments);
    this.$eventBinder = this.$container;
  },


  /*
  * Triggers an event on both this section instance and the sections object so
  * so that any event handlers attached using `sections.on()` will be also
  * triggered.
  */
  trigger: function trigger() {
    // Convert arguments object into an array
    var args = Array.prototype.slice.call(arguments);

    // Check what the second argument is. If there is already an array keep it.
    args[1] = args[1] || [];

    // Add the section instance as the first item in the array. This will force
    // it to be the first param in the .on() callback
    args[1].splice(0, 0, this);

    this.$eventBinder.trigger.apply(this.$eventBinder, args);
    this.$eventBinder = this.$container;
  },


  /**
   * Extends this section instance with additional functionality.
   */
  extend: function extend(extension) {
    var init = extension.init;
    this.extensions.push(extension);

    _jquery2.default.extend(this, (0, _omit2.default)(extension, 'init'));

    if (_jquery2.default.isFunction(init)) {
      init.apply(this);
    }
  }
};

/**
 * Shortcut methods that are automatically namespaced for easy removal, e.g.
 * $(document).on('event' + this.namespace);
 */
Master.prototype.document = function () {
  var $document = (0, _jquery2.default)(document);
  var self = this;
  return {
    on: function on() {
      self.$eventBinder = $document;
      self.on.apply(self, arguments);
    },
    off: function off() {
      self.$eventBinder = $document;
      self.off.apply(self, arguments);
    },
    trigger: function trigger() {
      self.$eventBinder = $document;
      self.trigger.apply(self, arguments);
    }
  };
};

/**
 * Shortcut methods that are automatically namespaced for easy removal, e.g.
 * $(window).on('event' + this.namespace);
 */
Master.prototype.window = function () {
  var $window = (0, _jquery2.default)(window);
  var self = this;
  return {
    on: function on() {
      self.$eventBinder = $window;
      self.on.apply(self, arguments);
    },
    off: function off() {
      self.$eventBinder = $window;
      self.off.apply(self, arguments);
    },
    trigger: function trigger() {
      self.$eventBinder = $window;
      self.trigger.apply(self, arguments);
    }
  };
};

function _applyExtensions() {
  var _this5 = this;

  this.extensions.forEach(function (extension) {
    _this5.extend(extension);
  });
}

function _applyEditorHandlers() {
  (0, _jquery2.default)(document).on('shopify:section:unload' + this.namespace, _onSectionUnload.bind(this)).on('shopify:section:select' + this.namespace, _onSelect.bind(this)).on('shopify:section:deselect' + this.namespace, _onDeselect.bind(this)).on('shopify:block:select' + this.namespace, _onBlockSelect.bind(this)).on('shopify:block:deselect' + this.namespace, _onBlockDeselect.bind(this));
}

function _applyDefaultHandlers() {
  this.on('section_load', this.onLoad.bind(this));
  this.on('section_unload', this.onUnload.bind(this));
  this.on('section_select', this.onSelect.bind(this));
  this.on('section_deselect', this.onDeselect.bind(this));
  this.on('block_select', this.onBlockSelect.bind(this));
  this.on('block_deselect', this.onBlockDeselect.bind(this));
}

function _onSectionUnload(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_unload';
  this.trigger(event);

  this.off(this.namespace);
  sections.off(this.namespace);
  (0, _jquery2.default)(document).off(this.namespace);
  (0, _jquery2.default)(window).off(this.namespace);

  (0, _remove2.default)(sections.instances, { id: this.id });
}

function _onSelect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_select';
  this.trigger(event);
}

function _onDeselect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'section_deselect';
  this.trigger(event);
}

function _onBlockSelect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'block_select';
  this.trigger(event);
}

function _onBlockDeselect(event) {
  if (this.id !== event.detail.sectionId) {
    return;
  }

  event.type = 'block_deselect';
  this.trigger(event);
}
