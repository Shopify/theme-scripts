'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _omit = require('lodash-es/omit');

var _omit2 = _interopRequireDefault(_omit);

var _find = require('lodash-es/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Templates() {
  this.registered = {};
  this.instances = [];
  this.extensions = {
    '*': []
  };
}

Templates.prototype = {
  register: function register(name, classname, properties) {
    function Template(container, extensions) {
      this.name = name.toLowerCase();
      this.container = container;
      this.$container = (0, _jquery2.default)(container);
      this.extensions = extensions;
      Master.call(this);
    }

    Template.classname = classname;
    Template.constructor = Template;
    Template.prototype = Object.create(Master.prototype);
    _jquery2.default.extend(Template.prototype, properties);

    this.registered[name] = Template;
  },

  extend: function extend(names, extension) {
    if (names === '*') {
      names = Object.keys(this.registered);
      names.push('*');
    } else if (typeof names === 'string') {
      names = [names];
    }

    names.forEach(function (name) {
      this.extensions[name] = this.extensions[name] || [];
      this.extensions[name].push(extension);

      if (typeof this.registered[name] === 'undefined' || name === '*') {
        return;
      }

      this.instances.forEach(function (instance) {
        if (instance.name !== name) {
          return;
        }
        instance.extend(extension);
      });
    }.bind(this));
  },

  load: function load(names) {
    if (names === '*') {
      names = Object.keys(this.registered);
    } else if (typeof names === 'string') {
      names = [names];
    }

    names.forEach(this._loadTemplate.bind(this));
  },

  _loadTemplate: function _loadTemplate(name) {
    var Template = this.registered[name];
    var instance = (0, _find2.default)(this.instances, { name: name });
    var container;
    var extensions;

    // If the template name is not registered or already has an instance loaded,
    // then return
    if (typeof Template === 'undefined' || instance) {
      return;
    }

    // Get the container for the template
    if (Template.classname === '*') {
      container = document.body;
    } else {
      container = document.querySelector('body.' + Template.classname);
    }

    // If we don't have the specified container on the page then return
    if (!container) {
      return;
    }

    // Get all extensions for the new template instance
    extensions = this.extensions['*'].concat(this.extensions[name] || []);
    instance = new Template(container, extensions);

    // Call the onLoad function of the template if it exists
    if (_jquery2.default.isFunction(instance.onLoad)) {
      instance.onLoad(container);
    }

    // Push the template instance to storage
    this.instances.push(instance);
  }
};

function Master() {
  this.extensions.forEach(function (extension) {
    this.extend(extension);
  }.bind(this));
}

Master.prototype = {
  extend: function extend(extension) {
    var init = extension.init;
    this.extensions.push(extension);

    if (_jquery2.default.isFunction(init)) {
      extension = (0, _omit2.default)(extension, 'init');
    }

    _jquery2.default.extend(this, extension);
    init.apply(this);
  }
};

exports.default = new Templates();
