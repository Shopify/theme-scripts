'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.validate = validate;
exports.getVariant = getVariant;
exports.optionArrayFromOptionCollection = optionArrayFromOptionCollection;

var _find = require('lodash-es/find');

var _find2 = _interopRequireDefault(_find);

var _findIndex = require('lodash-es/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _isArray = require('lodash-es/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(product) {
  if ((typeof product === 'undefined' ? 'undefined' : (0, _typeof3.default)(product)) !== 'object' || typeof product.id !== 'number') {
    throw Error('Please pass a valid Product object to the Product Controller');
  }

  return $.extend({}, product);
}

function getVariant(product, value) {
  var variant = void 0;

  if (typeof value === 'string' || typeof value === 'number') {
    // If value is an id
    variant = this._getVariantFromId(product, value);
  } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' && typeof value.id === 'number') {
    // If value is a variant object containing an id key
    variant = this._getVariantFromId(product, value.id);
  } else if ((0, _isArray2.default)(value)) {
    // If value is an array of options
    if ((0, _typeof3.default)(value[0]) === 'object') {
      // If value is a collection of options with name and value keys
      variant = this._getVariantFromOptionCollection(product, value);
    } else {
      // If value is an array of option values, ordered by index of array
      variant = this._getVariantFromOptionArray(product, value);
    }
  }

  return variant;
}

function optionArrayFromOptionCollection(product, collection) {
  var optionArray = [];

  collection.forEach(function (option) {
    var index = void 0;

    if (typeof option.name !== 'string') {
      throw Error('Invalid value type passed for name of option ' + index + '. Value should be string.');
    }

    index = (0, _findIndex2.default)(product.options, function (name) {
      return name.toLowerCase() === option.name.toLowerCase();
    });

    if (index === -1) {
      throw Error('Invalid option name, ' + option.name);
    }

    optionArray[index] = option.value;
  });

  return optionArray;
}

function _getVariantFromId(product, id) {
  return (0, _find2.default)(product.variants, { id: id });
}

function _getVariantFromOptionCollection(product, collection, closest) {
  var optionArray = this.optionArrayFromOptionCollection(product, collection);

  return this._getVariantFromOptionArray(product, optionArray, closest);
}

function _getVariantFromOptionArray(product, options) {
  return (0, _find2.default)(product.variants, function (variant) {
    return options.every(function (option, index) {
      return variant.options[index] === option;
    });
  });
}
