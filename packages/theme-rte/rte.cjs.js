'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapTable = wrapTable;
exports.wrapIframe = wrapIframe;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wrap tables in a container div to make them scrollable when needed
 *
 * @param {object} options - Options to be used
 * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
 * @param {string} options.tableWrapperClass - table wrapper class name
 */
function wrapTable(options) {
  var tableWrapperClass = typeof options.tableWrapperClass === 'undefined' ? '' : options.tableWrapperClass;

  options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
}

/**
 * Wrap iframes in a container div to make them responsive
 *
 * @param {object} options - Options to be used
 * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
 * @param {string} options.iframeWrapperClass - class name used on the wrapping div
 */
/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 */

function wrapIframe(options) {
  var iframeWrapperClass = typeof options.iframeWrapperClass === 'undefined' ? '' : options.iframeWrapperClass;

  options.$iframes.each(function () {
    // Add wrapper to make video responsive
    (0, _jquery2.default)(this).wrap('<div class="' + iframeWrapperClass + '"></div>');

    // Re-set the src attribute on each iframe after page load
    // for Chrome's "incorrect iFrame content on 'back'" bug.
    // https://code.google.com/p/chromium/issues/detail?id=395791
    // Need to specifically target video and admin bar
    this.src = this.src;
  });
}
