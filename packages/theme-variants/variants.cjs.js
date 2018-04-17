"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _jquery = require("jquery");

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

var Variants = function () {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */

  function Variants(options) {
    (0, _classCallCheck3.default)(this, Variants);

    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    (0, _jquery2.default)(this.singleOptionSelector, this.$container).on("change", this._onSelectChange.bind(this));
  }

  /**
   * Get the currently selected options from add-to-cart form. Works with all
   * form input elements.
   *
   * @return {array} options - Values of currently selected variants
   */


  (0, _createClass3.default)(Variants, [{
    key: "_getCurrentOptions",
    value: function _getCurrentOptions() {
      var currentOptions = _jquery2.default.map((0, _jquery2.default)(this.singleOptionSelector, this.$container), function (element) {
        var $element = (0, _jquery2.default)(element);
        var type = $element.attr("type");
        var currentOption = {};

        if (type === "radio" || type === "checkbox") {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data("index");

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data("index");

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    }

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */

  }, {
    key: "_getVariantFromOptions",
    value: function _getVariantFromOptions() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function (variant) {
        var satisfied = true;

        selectedValues.forEach(function (option) {
          if (satisfied) {
            satisfied = option.value === variant[option.index];
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    }

    /**
     * Event handler for when a variant input changes.
     */

  }, {
    key: "_onSelectChange",
    value: function _onSelectChange() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: "variantChange",
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    }

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */

  }, {
    key: "_updateImages",
    value: function _updateImages(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: "variantImageChange",
        variant: variant
      });
    }

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */

  }, {
    key: "_updatePrice",
    value: function _updatePrice(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: "variantPriceChange",
        variant: variant
      });
    }

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */

  }, {
    key: "_updateHistoryState",
    value: function _updateHistoryState(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?variant=" + variant.id;
      window.history.replaceState({ path: newurl }, "", newurl);
    }

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */

  }, {
    key: "_updateMasterSelect",
    value: function _updateMasterSelect(variant) {
      (0, _jquery2.default)(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  }]);
  return Variants;
}();
