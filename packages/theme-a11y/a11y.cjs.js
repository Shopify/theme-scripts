'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageLinkFocus = pageLinkFocus;
exports.focusHash = focusHash;
exports.bindInPageLinks = bindInPageLinks;
exports.trapFocus = trapFocus;
exports.removeTrapFocus = removeTrapFocus;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * For use when focus shifts to a container rather than a link
 * eg for In-page links, after scroll, focus shifts to content area so that
 * next `tab` is where user expects if focusing a link, just $link.focus();
 *
 * @param {JQuery} $element - The element to be acted upon
 */
function pageLinkFocus($element) {
  var focusClass = 'js-focus-hidden';

  $element.first().attr('tabIndex', '-1').focus().addClass(focusClass).one('blur', callback);

  function callback() {
    $element.first().removeClass(focusClass).removeAttr('tabindex');
  }
}

/**
 * If there's a hash in the url, focus the appropriate element
 */
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 */

function focusHash() {
  var hash = window.location.hash;

  // is there a hash in the url? is it an element on the page?
  if (hash && document.getElementById(hash.slice(1))) {
    this.pageLinkFocus((0, _jquery2.default)(hash));
  }
}

/**
 * When an in-page (url w/hash) link is clicked, focus the appropriate element
 */
function bindInPageLinks() {
  var _this = this;

  (0, _jquery2.default)('a[href*=#]').on('click', function (evt) {
    _this.pageLinkFocus((0, _jquery2.default)(evt.currentTarget.hash));
  });
}

/**
 * Traps the focus in a particular container
 *
 * @param {object} options - Options to be used
 * @param {jQuery} options.$container - Container to trap focus within
 * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
 * @param {string} options.namespace - Namespace used for new focus event handler
 */
function trapFocus(options) {
  var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';

  if (!options.$elementToFocus) {
    options.$elementToFocus = options.$container;
  }

  options.$container.attr('tabindex', '-1');
  options.$elementToFocus.focus();

  (0, _jquery2.default)(document).on(eventName, function (evt) {
    if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
      options.$container.focus();
    }
  });
}

/**
 * Removes the trap of focus in a particular container
 *
 * @param {object} options - Options to be used
 * @param {jQuery} options.$container - Container to trap focus within
 * @param {string} options.namespace - Namespace used for new focus event handler
 */
function removeTrapFocus(options) {
  var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';

  if (options.$container && options.$container.length) {
    options.$container.removeAttr('tabindex');
  }

  (0, _jquery2.default)(document).off(eventName);
}
