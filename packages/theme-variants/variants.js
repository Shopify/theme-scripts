import $ from 'jquery';

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

export default class Variants {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */

  constructor(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  /**
   * Get the currently selected options from add-to-cart form. Works with all
   * form input elements.
   *
   * @return {array} options - Values of currently selected variants
   */
  _getCurrentOptions() {
    var currentOptions = [];

    $.map($(this.singleOptionSelector, this.$container), function(element) {
      var $element = $(element);
      var type = $element.attr('type');
      var currentOption = {};

      if (type === 'radio' || type === 'checkbox') {
        if ($element[0].checked) {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          currentOptions.push(currentOption);
        }
      } else {
        currentOption.value = $element.val();
        currentOption.index = $element.data('index');

        currentOptions.push(currentOption);
      }
    });

    return currentOptions;
  }

  /**
   * Find variant based on selected values.
   *
   * @param  {array} selectedValues - Values of variant inputs
   * @return {object || undefined} found - Variant object from product.variants
   */
  _getVariantFromOptions() {
    var selectedValues = this._getCurrentOptions();
    var variants = this.product.variants;
    var found = false;

    variants.forEach(function(variant) {
      var satisfied = true;

      selectedValues.forEach(function(option) {
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
  _onSelectChange() {
    var variant = this._getVariantFromOptions();

    this.$container.trigger({
      type: 'variantChange',
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
  _updateImages(variant) {
    var variantImage = variant.featured_image || {};
    var currentVariantImage = this.currentVariant.featured_image || {};

    if (
      !variant.featured_image ||
      variantImage.src === currentVariantImage.src
    ) {
      return;
    }

    this.$container.trigger({
      type: 'variantImageChange',
      variant: variant
    });
  }

  /**
   * Trigger event when variant price changes.
   *
   * @param  {object} variant - Currently selected variant
   * @return {event} variantPriceChange
   */
  _updatePrice(variant) {
    if (
      variant.price === this.currentVariant.price &&
      variant.compare_at_price === this.currentVariant.compare_at_price
    ) {
      return;
    }

    this.$container.trigger({
      type: 'variantPriceChange',
      variant: variant
    });
  }

  /**
   * Update history state for product deeplinking
   *
   * @param {object} variant - Currently selected variant
   */
  _updateHistoryState(variant) {
    if (!history.replaceState || !variant) {
      return;
    }

    var newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?variant=' +
      variant.id;
    window.history.replaceState({ path: newurl }, '', newurl);
  }

  /**
   * Update hidden master select of variant change
   *
   * @param {object} variant - Currently selected variant
   */
  _updateMasterSelect(variant) {
    $(this.originalSelectorId, this.$container)[0].value = variant.id;
  }
}
