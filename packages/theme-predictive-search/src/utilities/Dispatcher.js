export default function Dispatcher() {
  this.events = {};
}

Dispatcher.prototype.on = function(eventName, callback) {
  var event = this.events[eventName];
  if (!event) {
    event = new DispatcherEvent(eventName);
    this.events[eventName] = event;
  }
  event.registerCallback(callback);
};

Dispatcher.prototype.off = function(eventName, callback) {
  var event = this.events[eventName];
  if (event && event.callbacks.indexOf(callback) > -1) {
    event.unregisterCallback(callback);
    if (event.callbacks.length === 0) {
      delete this.events[eventName];
    }
  }
};

Dispatcher.prototype.dispatch = function(eventName, payload) {
  var event = this.events[eventName];
  if (event) {
    event.fire(payload);
  }
};

function DispatcherEvent(eventName) {
  this.eventName = eventName;
  this.callbacks = [];
}

DispatcherEvent.prototype.registerCallback = function(callback) {
  this.callbacks.push(callback);
};

DispatcherEvent.prototype.unregisterCallback = function(callback) {
  var index = this.callbacks.indexOf(callback);
  if (index > -1) {
    this.callbacks.splice(index, 1);
  }
};

DispatcherEvent.prototype.fire = function(payload) {
  var callbacks = this.callbacks.slice(0);
  callbacks.forEach(function(callback) {
    callback(payload);
  });
};
