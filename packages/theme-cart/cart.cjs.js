'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCart = getCart;
exports.updateNote = updateNote;
exports.addItem = addItem;
exports.addItemFromForm = addItemFromForm;
exports.removeItem = removeItem;
exports.changeItem = changeItem;
exports.saveLocalState = saveLocalState;
exports.getLocalState = getLocalState;
exports.cookiesEnabled = cookiesEnabled;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _find = require('lodash-es/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

function getCart() {
  return _jquery2.default.getJSON('/cart.js');
}

function updateNote(note) {
  return _promiseChange({
    url: '/cart/update.js',
    dataType: 'json',
    data: {
      note: note || ''
    }
  });
}

function addItem(id, quantity) {
  return _promiseChange({
    url: '/cart/add.js',
    dataType: 'json',
    data: {
      id: id,
      quantity: typeof quantity === 'undefined' ? 1 : quantity
    }
  });
}

function addItemFromForm(data) {
  return _promiseChange({
    url: '/cart/add.js',
    dataType: 'json',
    data: data
  });
}

function removeItem(id) {
  return _promiseChange({
    url: '/cart/change.js',
    dataType: 'json',
    data: {
      id: id,
      quantity: 0
    }
  });
}

function changeItem(id, quantity) {
  var originalQuantity = parseInt(quantity, 10);
  var requestSettings = {
    url: '/cart/change.js',
    dataType: 'json',
    data: {
      id: id,
      quantity: quantity
    }
  };

  return _promiseChange(requestSettings);
}

function saveLocalState(state) {
  if (_isLocalStorageSupported()) {
    localStorage.shopify_cart_state = JSON.stringify(state); // eslint-disable-line camelcase
  }

  return state;
}

function getLocalState() {
  // eslint-disable-line consistent-return
  if (_isLocalStorageSupported()) {
    return JSON.parse(localStorage.shopify_cart_state || '');
  }
}

function cookiesEnabled() {
  var cookieEnabled = navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
  }
  return cookieEnabled;
}

function _promiseChange(parameters) {
  var promiseRequest = _jquery2.default.ajax(parameters);

  // If offline, provide a rejected promise so that an error is thrown.
  if (navigator && !navigator.onLine) {
    promiseRequest = _jquery2.default.Deferred().reject();
  }

  return promiseRequest
  // Some cart API requests don't return the cart object. If there is no
  // cart object then get one before proceeding.
  .then(function (state) {
    if (typeof state.token === 'undefined') {
      return getCart();
    } else {
      return state;
    }
  }).then(saveLocalState);
}

function _isLocalStorageSupported() {
  var mod = 'localStorageTest';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (error) {
    return false;
  }
}
