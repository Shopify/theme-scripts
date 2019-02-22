export default function Cache(config) {
  this._store = {};
  this._keys = [];
  if (config && config.bucketSize) {
    this.bucketSize = config.bucketSize;
  } else {
    this.bucketSize = 20;
  }
}

Cache.prototype.set = function(key, value) {
  if (this.count() >= this.bucketSize) {
    var deleteKey = this._keys.splice(0, 1);
    this.delete(deleteKey);
  }

  this._keys.push(key);
  this._store[key] = value;

  return this._store;
};

Cache.prototype.get = function(key) {
  return this._store[key];
};

Cache.prototype.has = function(key) {
  return Boolean(this._store[key]);
};

Cache.prototype.count = function() {
  return Object.keys(this._store).length;
};

Cache.prototype.delete = function(key) {
  var exists = Boolean(this._store[key]);
  delete this._store[key];
  return exists && !this._store[key];
};
