import $ from 'jquery';
import omit from 'lodash-es/omit';
import find from 'lodash-es/find';

function Templates() {
  this.registered = {};
  this.instances = [];
  this.extensions = {
    '*': []
  };
}

Templates.prototype = {
  register: function(name, classname, properties) {
    function Template(container, extensions) {
      this.name = name.toLowerCase();
      this.container = container;
      this.$container = $(container);
      this.extensions = extensions;
      Master.call(this);
    }

    Template.classname = classname;
    Template.constructor = Template;
    Template.prototype = Object.create(Master.prototype);
    $.extend(Template.prototype, properties);

    this.registered[name] = Template;
  },

  extend: function(names, extension) {
    if (names === '*') {
      names = Object.keys(this.registered);
      names.push('*');
    } else if (typeof names === 'string') {
      names = [names];
    }

    names.forEach(function(name) {
      this.extensions[name] = this.extensions[name] || [];
      this.extensions[name].push(extension);

      if (typeof this.registered[name] === 'undefined' || name === '*') { return; }

      this.instances.forEach(function(instance) {
        if (instance.name !== name) { return; }
        instance.extend(extension);
      });
    }.bind(this));
  },

  load: function(names) {
    if (names === '*') {
      names = Object.keys(this.registered);
    } else if (typeof names === 'string') {
      names = [names];
    }

    names.forEach(this._loadTemplate.bind(this));
  },

  _loadTemplate: function(name) {
    var Template = this.registered[name];
    var instance = find(this.instances, {name: name});
    var container;
    var extensions;

    // If the template name is not registered or already has an instance loaded,
    // then return
    if (typeof Template === 'undefined' || instance) { return; }

    // Get the container for the template
    if (Template.classname === '*') {
      container = document.body;
    } else {
      container = document.querySelector('body.' + Template.classname);
    }

    // If we don't have the specified container on the page then return
    if (!container) { return; }

    // Get all extensions for the new template instance
    extensions = this.extensions['*'].concat(this.extensions[name] || []);
    instance = new Template(container, extensions);

    // Call the onLoad function of the template if it exists
    if ($.isFunction(instance.onLoad)) {
      instance.onLoad(container);
    }

    // Push the template instance to storage
    this.instances.push(instance);
  }
};

function Master() {
  this.extensions.forEach(function(extension) {
    this.extend(extension);
  }.bind(this));
}

Master.prototype = {
  extend: function(extension) {
    var init = extension.init;
    this.extensions.push(extension);

    if ($.isFunction(init)) {
      extension = omit(extension, 'init');
    }

    $.extend(this, extension);
    init.apply(this);
  }
};

export default new Templates();
