import { validateQuery } from "./validate";
import request from "./request";
import { debounce, objectToQueryParams, Dispatcher, Cache } from "./utilities";

var requestDebounced = debounce(
  request,
  PredictiveSearch.prototype.DEBOUNCE_RATE
);

export default function PredictiveSearch(config) {
  if (!config) {
    throw new TypeError("No config object was specified");
  }

  this._retryAfter = null;
  this._currentQuery = null;

  this.dispatcher = new Dispatcher();
  this.cache = new Cache({ bucketSize: 40 });
  this.configParams = objectToQueryParams(config);
}

PredictiveSearch.TYPES = {
  PRODUCT: "product"
};

PredictiveSearch.prototype.DEBOUNCE_RATE = 10;

PredictiveSearch.prototype.query = function query(query) {
  try {
    validateQuery(query);
  } catch (error) {
    this.dispatcher.dispatch("error", error);
    return;
  }

  if (query === "") {
    return this;
  }

  this._currentQuery = normalizeQuery(query);
  var cacheResult = this.cache.get(this._currentQuery);
  if (cacheResult) {
    this.dispatcher.dispatch("success", cacheResult);
    return this;
  }

  requestDebounced(
    this.configParams,
    query,
    function(result) {
      this.cache.set(normalizeQuery(result.query), result);
      if (normalizeQuery(result.query) === this._currentQuery) {
        this._retryAfter = null;
        this.dispatcher.dispatch("success", result);
      }
    }.bind(this),
    function(error) {
      if (error.retryAfter) {
        this._retryAfter = error.retryAfter;
      }
      this.dispatcher.dispatch("error", error);
    }.bind(this)
  );

  return this;
};

PredictiveSearch.prototype.on = function on(eventName, callback) {
  this.dispatcher.on(eventName, callback);

  return this;
};

PredictiveSearch.prototype.off = function on(eventName, callback) {
  this.dispatcher.off(eventName, callback);

  return this;
};

function normalizeQuery(query) {
  if (typeof query !== "string") {
    return null;
  }

  return query
    .trim()
    .replace(" ", "-")
    .toLowerCase();
}
