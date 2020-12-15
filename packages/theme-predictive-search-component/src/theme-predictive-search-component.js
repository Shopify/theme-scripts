import PredictiveSearch from "@shopify/theme-predictive-search";

var DEFAULT_PREDICTIVE_SEARCH_API_CONFIG = {
  search_path: PredictiveSearch.SEARCH_PATH,
  resources: {
    type: [PredictiveSearch.TYPES.PRODUCT],
    options: {
      unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
      fields: [
        PredictiveSearch.FIELDS.TITLE,
        PredictiveSearch.FIELDS.VENDOR,
        PredictiveSearch.FIELDS.PRODUCT_TYPE,
        PredictiveSearch.FIELDS.VARIANTS_TITLE
      ]
    }
  }
};

function PredictiveSearchComponent(config) {
  // validate config
  if (
    !config ||
    !config.selectors ||
    !config.selectors.input ||
    !isString(config.selectors.input) ||
    !config.selectors.result ||
    !isString(config.selectors.result) ||
    !config.resultTemplateFct ||
    !isFunction(config.resultTemplateFct) ||
    !config.numberOfResultsTemplateFct ||
    !isFunction(config.numberOfResultsTemplateFct) ||
    !config.loadingResultsMessageTemplateFct ||
    !isFunction(config.loadingResultsMessageTemplateFct)
  ) {
    var error = new TypeError("PredictiveSearchComponent config is not valid");
    error.type = "argument";
    throw error;
  }

  // Find nodes
  this.nodes = findNodes(config.selectors);

  // Validate nodes
  if (!isValidNodes(this.nodes)) {
    // eslint-disable-next-line no-console
    console.warn("Could not find valid nodes");
    return;
  }

  // Store the keyword that was used for the search
  this._searchKeyword = "";

  // Assign result template
  this.resultTemplateFct = config.resultTemplateFct;

  // Assign number of results template
  this.numberOfResultsTemplateFct = config.numberOfResultsTemplateFct;

  // Assign loading state template function
  this.loadingResultsMessageTemplateFct =
    config.loadingResultsMessageTemplateFct;

  // Assign number of search results
  this.numberOfResults = config.numberOfResults || 4;

  // Set classes
  this.classes = {
    visibleVariant: config.visibleVariant ?
      config.visibleVariant :
      "predictive-search-wrapper--visible",
    itemSelected: config.itemSelectedClass ?
      config.itemSelectedClass :
      "predictive-search-item--selected",
    clearButtonVisible: config.clearButtonVisibleClass ?
      config.clearButtonVisibleClass :
      "predictive-search__clear-button--visible"
  };

  this.selectors = {
    searchResult: config.searchResult ?
      config.searchResult :
      "[data-search-result]"
  };

  // Assign callbacks
  this.callbacks = assignCallbacks(config);

  // Add input attributes
  addInputAttributes(this.nodes.input);

  // Add input event listeners
  this._addInputEventListeners();

  // Add body listener
  this._addBodyEventListener();

  // Add accessibility announcer
  this._addAccessibilityAnnouncer();

  // Display the reset button if the input is not empty
  this._toggleClearButtonVisibility();

  // Instantiate Predictive Search API
  this.predictiveSearch = new PredictiveSearch(
    config.PredictiveSearchAPIConfig ?
    config.PredictiveSearchAPIConfig :
    DEFAULT_PREDICTIVE_SEARCH_API_CONFIG
  );

  // Add predictive search success event listener
  this.predictiveSearch.on(
    "success",
    this._handlePredictiveSearchSuccess.bind(this)
  );

  // Add predictive search error event listener
  this.predictiveSearch.on(
    "error",
    this._handlePredictiveSearchError.bind(this)
  );
}

/**
 * Private methods
 */
function findNodes(selectors) {
  return {
    input: document.querySelector(selectors.input),
    reset: document.querySelector(selectors.reset),
    result: document.querySelector(selectors.result)
  };
}

function isValidNodes(nodes) {
  if (
    !nodes ||
    !nodes.input ||
    !nodes.result ||
    nodes.input.tagName !== "INPUT"
  ) {
    return false;
  }

  return true;
}

function assignCallbacks(config) {
  return {
    onBodyMousedown: config.onBodyMousedown,
    onBeforeOpen: config.onBeforeOpen,
    onOpen: config.onOpen,
    onBeforeClose: config.onBeforeClose,
    onClose: config.onClose,
    onInputFocus: config.onInputFocus,
    onInputKeyup: config.onInputKeyup,
    onInputBlur: config.onInputBlur,
    onInputReset: config.onInputReset,
    onBeforeDestroy: config.onBeforeDestroy,
    onDestroy: config.onDestroy
  };
}

function addInputAttributes(input) {
  input.setAttribute("autocorrect", "off");
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("spellcheck", "false");
}

function removeInputAttributes(input) {
  input.removeAttribute("autocorrect", "off");
  input.removeAttribute("autocomplete", "off");
  input.removeAttribute("autocapitalize", "off");
  input.removeAttribute("spellcheck", "false");
}

/**
 * Public variables
 */
PredictiveSearchComponent.prototype.isResultVisible = false;
PredictiveSearchComponent.prototype.results = {};

/**
 * "Private" variables
 */
PredictiveSearchComponent.prototype._latencyTimer = null;
PredictiveSearchComponent.prototype._resultNodeClicked = false;

/**
 * "Private" instance methods
 */
PredictiveSearchComponent.prototype._addInputEventListeners = function () {
  var input = this.nodes.input;
  var reset = this.nodes.reset;

  if (!input) {
    return;
  }

  this._handleInputFocus = this._handleInputFocus.bind(this);
  this._handleInputBlur = this._handleInputBlur.bind(this);
  this._handleInputKeyup = this._handleInputKeyup.bind(this);
  this._handleInputKeydown = this._handleInputKeydown.bind(this);

  input.addEventListener("focus", this._handleInputFocus);
  input.addEventListener("blur", this._handleInputBlur);
  input.addEventListener("keyup", this._handleInputKeyup);
  input.addEventListener("keydown", this._handleInputKeydown);

  if (reset) {
    this._handleInputReset = this._handleInputReset.bind(this);
    reset.addEventListener("click", this._handleInputReset);
  }
};

PredictiveSearchComponent.prototype._removeInputEventListeners = function () {
  var input = this.nodes.input;

  input.removeEventListener("focus", this._handleInputFocus);
  input.removeEventListener("blur", this._handleInputBlur);
  input.removeEventListener("keyup", this._handleInputKeyup);
  input.removeEventListener("keydown", this._handleInputKeydown);
};

PredictiveSearchComponent.prototype._addBodyEventListener = function () {
  this._handleBodyMousedown = this._handleBodyMousedown.bind(this);

  document
    .querySelector("body")
    .addEventListener("mousedown", this._handleBodyMousedown);
};

PredictiveSearchComponent.prototype._removeBodyEventListener = function () {
  document
    .querySelector("body")
    .removeEventListener("mousedown", this._handleBodyMousedown);
};

PredictiveSearchComponent.prototype._removeClearButtonEventListener = function () {
  var reset = this.nodes.reset;

  if (!reset) {
    return;
  }

  reset.removeEventListener("click", this._handleInputReset);
};

/**
 * Event handlers
 */
PredictiveSearchComponent.prototype._handleBodyMousedown = function (evt) {
  if (this.isResultVisible && this.nodes !== null) {
    if (
      evt.target.isEqualNode(this.nodes.input) ||
      this.nodes.input.contains(evt.target) ||
      evt.target.isEqualNode(this.nodes.result) ||
      this.nodes.result.contains(evt.target)
    ) {
      this._resultNodeClicked = true;
    } else {
      if (isFunction(this.callbacks.onBodyMousedown)) {
        var returnedValue = this.callbacks.onBodyMousedown(this.nodes);
        if (isBoolean(returnedValue) && returnedValue) {
          this.close();
        }
      } else {
        this.close();
      }
    }
  }
};

PredictiveSearchComponent.prototype._handleInputFocus = function (evt) {
  if (isFunction(this.callbacks.onInputFocus)) {
    var returnedValue = this.callbacks.onInputFocus(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  if (evt.target.value.length > 0) {
    this._search();
  }

  return true;
};

PredictiveSearchComponent.prototype._handleInputBlur = function () {
  // This has to be done async, to wait for the focus to be on the next
  // element and avoid closing the results.
  // Example: Going from the input to the reset button.
  setTimeout(
    function () {
      if (isFunction(this.callbacks.onInputBlur)) {
        var returnedValue = this.callbacks.onInputBlur(this.nodes);
        if (isBoolean(returnedValue) && !returnedValue) {
          return false;
        }
      }

      if (document.activeElement.isEqualNode(this.nodes.reset)) {
        return false;
      }

      if (this._resultNodeClicked) {
        this._resultNodeClicked = false;
        return false;
      }

      this.close();
    }.bind(this)
  );

  return true;
};

PredictiveSearchComponent.prototype._addAccessibilityAnnouncer = function () {
  this._accessibilityAnnouncerDiv = window.document.createElement("div");

  this._accessibilityAnnouncerDiv.setAttribute(
    "style",
    "position: absolute !important; overflow: hidden; clip: rect(0 0 0 0); height: 1px; width: 1px; margin: -1px; padding: 0; border: 0;"
  );

  this._accessibilityAnnouncerDiv.setAttribute("data-search-announcer", "");
  this._accessibilityAnnouncerDiv.setAttribute("aria-live", "polite");
  this._accessibilityAnnouncerDiv.setAttribute("aria-atomic", "true");

  this.nodes.result.parentElement.appendChild(this._accessibilityAnnouncerDiv);
};

PredictiveSearchComponent.prototype._removeAccessibilityAnnouncer = function () {
  this.nodes.result.parentElement.removeChild(this._accessibilityAnnouncerDiv);
};

PredictiveSearchComponent.prototype._updateAccessibilityAttributesAfterSelectingElement = function (
  previousSelectedElement,
  currentSelectedElement
) {
  // Update the active descendant on the search input
  this.nodes.input.setAttribute(
    "aria-activedescendant",
    currentSelectedElement.id
  );

  // Unmark the previousSelected elemented as selected
  if (previousSelectedElement) {
    previousSelectedElement.removeAttribute("aria-selected");
  }

  // Mark the element as selected
  currentSelectedElement.setAttribute("aria-selected", true);
};

PredictiveSearchComponent.prototype._clearAriaActiveDescendant = function () {
  this.nodes.input.setAttribute("aria-activedescendant", "");
};

PredictiveSearchComponent.prototype._announceNumberOfResultsFound = function (
  results
) {
  var currentAnnouncedMessage = this._accessibilityAnnouncerDiv.innerHTML;
  var newMessage = this.numberOfResultsTemplateFct(results);

  // If the messages are the same, they won't get announced
  // add white space so it gets announced
  if (currentAnnouncedMessage === newMessage) {
    newMessage = newMessage + "&nbsp;";
  }

  this._accessibilityAnnouncerDiv.innerHTML = newMessage;
};

PredictiveSearchComponent.prototype._announceLoadingState = function () {
  this._accessibilityAnnouncerDiv.innerHTML = this.loadingResultsMessageTemplateFct();
};

PredictiveSearchComponent.prototype._handleInputKeyup = function (evt) {
  var UP_ARROW_KEY_CODE = 38;
  var DOWN_ARROW_KEY_CODE = 40;
  var RETURN_KEY_CODE = 13;
  var ESCAPE_KEY_CODE = 27;
  var BACKSPACE = 8;

  if (isFunction(this.callbacks.onInputKeyup)) {
    var returnedValue = this.callbacks.onInputKeyup(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this._toggleClearButtonVisibility();

  if (this.isResultVisible && this.nodes !== null) {
    if (evt.keyCode === UP_ARROW_KEY_CODE) {
      this._navigateOption(evt, "UP");
      return true;
    }

    if (evt.keyCode === DOWN_ARROW_KEY_CODE) {
      this._navigateOption(evt, "DOWN");
      return true;
    }

    if (evt.keyCode === RETURN_KEY_CODE) {
      this._selectOption();
      return true;
    }

    if (evt.keyCode === ESCAPE_KEY_CODE) {
      this.close();
    }
  }

  if (BACKSPACE === 8 && evt.target.value.length <= 0) {
    this.close();
    this._setKeyword("");
  } else if (evt.target.value.length > 0) {
    this._search();
  }

  return true;
};

PredictiveSearchComponent.prototype._handleInputKeydown = function (evt) {
  var RETURN_KEY_CODE = 13;
  var UP_ARROW_KEY_CODE = 38;
  var DOWN_ARROW_KEY_CODE = 40;

  // Prevent the form default submission if there is a selected option
  if (evt.keyCode === RETURN_KEY_CODE && this._getSelectedOption() != null) {
    evt.preventDefault();
  }

  // Prevent the cursor from moving in the input when using the up and down arrow keys
  if (
    evt.keyCode === UP_ARROW_KEY_CODE ||
    evt.keyCode === DOWN_ARROW_KEY_CODE
  ) {
    evt.preventDefault();
  }
};

PredictiveSearchComponent.prototype._handleInputReset = function (evt) {
  evt.preventDefault();

  if (isFunction(this.callbacks.onInputReset)) {
    var returnedValue = this.callbacks.onInputReset(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.input.value = "";
  this.nodes.input.focus();
  this._toggleClearButtonVisibility();
  this.close();

  return true;
};

PredictiveSearchComponent.prototype._navigateOption = function (evt, direction) {
  var currentOption = this._getSelectedOption();

  if (!currentOption) {
    var firstOption = this.nodes.result.querySelector(
      this.selectors.searchResult
    );
    firstOption.classList.add(this.classes.itemSelected);
    this._updateAccessibilityAttributesAfterSelectingElement(null, firstOption);
  } else {
    if (direction === "DOWN") {
      var nextOption = currentOption.nextElementSibling;
      if (nextOption) {
        currentOption.classList.remove(this.classes.itemSelected);
        nextOption.classList.add(this.classes.itemSelected);
        this._updateAccessibilityAttributesAfterSelectingElement(
          currentOption,
          nextOption
        );
      }
    } else {
      var previousOption = currentOption.previousElementSibling;
      if (previousOption) {
        currentOption.classList.remove(this.classes.itemSelected);
        previousOption.classList.add(this.classes.itemSelected);
        this._updateAccessibilityAttributesAfterSelectingElement(
          currentOption,
          previousOption
        );
      }
    }
  }
};

PredictiveSearchComponent.prototype._getSelectedOption = function () {
  return this.nodes.result.querySelector("." + this.classes.itemSelected);
};

PredictiveSearchComponent.prototype._selectOption = function () {
  var selectedOption = this._getSelectedOption();

  if (selectedOption) {
    selectedOption.querySelector("a, button").click();
  }
};

PredictiveSearchComponent.prototype._search = function () {
  var newSearchKeyword = this.nodes.input.value;

  if (this._searchKeyword === newSearchKeyword) {
    return;
  }

  clearTimeout(this._latencyTimer);
  this._latencyTimer = setTimeout(
    function () {
      this.results.isLoading = true;

      // Annonuce that we're loading the results
      this._announceLoadingState();

      this.nodes.result.classList.add(this.classes.visibleVariant);
      // NOTE: We could benifit in using DOMPurify.
      // https://github.com/cure53/DOMPurify
      this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
    }.bind(this),
    500
  );

  this.predictiveSearch.query(newSearchKeyword);
  this._setKeyword(newSearchKeyword);
};

PredictiveSearchComponent.prototype._handlePredictiveSearchSuccess = function (
  json
) {
  clearTimeout(this._latencyTimer);
  this.results = json.resources.results;

  this.results.isLoading = false;
  this.results.products = this.results.products.slice(0, this.numberOfResults);
  this.results.canLoadMore =
    this.numberOfResults <= this.results.products.length;
  this.results.searchQuery = this.nodes.input.value;

  if (this.results.products.length > 0 || this.results.searchQuery) {
    this.nodes.result.innerHTML = this.resultTemplateFct(this.results);
    this._announceNumberOfResultsFound(this.results);
    this.open();
  } else {
    this.nodes.result.innerHTML = "";

    this._closeOnNoResults();
  }
};

PredictiveSearchComponent.prototype._handlePredictiveSearchError = function () {
  clearTimeout(this._latencyTimer);
  this.nodes.result.innerHTML = "";

  this._closeOnNoResults();
};

PredictiveSearchComponent.prototype._closeOnNoResults = function () {
  if (this.nodes) {
    this.nodes.result.classList.remove(this.classes.visibleVariant);
  }

  this.isResultVisible = false;
};

PredictiveSearchComponent.prototype._setKeyword = function (keyword) {
  this._searchKeyword = keyword;
};

PredictiveSearchComponent.prototype._toggleClearButtonVisibility = function () {
  if (!this.nodes.reset) {
    return;
  }

  if (this.nodes.input.value.length > 0) {
    this.nodes.reset.classList.add(this.classes.clearButtonVisible);
  } else {
    this.nodes.reset.classList.remove(this.classes.clearButtonVisible);
  }
};

/**
 * Public methods
 */
PredictiveSearchComponent.prototype.open = function () {
  if (this.isResultVisible) {
    return;
  }

  if (isFunction(this.callbacks.onBeforeOpen)) {
    var returnedValue = this.callbacks.onBeforeOpen(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.result.classList.add(this.classes.visibleVariant);
  this.nodes.input.setAttribute("aria-expanded", true);
  this.isResultVisible = true;

  if (isFunction(this.callbacks.onOpen)) {
    return this.callbacks.onOpen(this.nodes) || true;
  }

  return true;
};

PredictiveSearchComponent.prototype.close = function () {
  if (!this.isResultVisible) {
    return true;
  }

  if (isFunction(this.callbacks.onBeforeClose)) {
    var returnedValue = this.callbacks.onBeforeClose(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  if (this.nodes) {
    this.nodes.result.classList.remove(this.classes.visibleVariant);
  }

  this.nodes.input.setAttribute("aria-expanded", false);
  this._clearAriaActiveDescendant();
  this._setKeyword("");

  if (isFunction(this.callbacks.onClose)) {
    this.callbacks.onClose(this.nodes);
  }

  this.isResultVisible = false;
  this.results = {};

  return true;
};

PredictiveSearchComponent.prototype.destroy = function () {
  this.close();

  if (isFunction(this.callbacks.onBeforeDestroy)) {
    var returnedValue = this.callbacks.onBeforeDestroy(this.nodes);
    if (isBoolean(returnedValue) && !returnedValue) {
      return false;
    }
  }

  this.nodes.result.classList.remove(this.classes.visibleVariant);
  removeInputAttributes(this.nodes.input);
  this._removeInputEventListeners();
  this._removeBodyEventListener();
  this._removeAccessibilityAnnouncer();
  this._removeClearButtonEventListener();

  if (isFunction(this.callbacks.onDestroy)) {
    this.callbacks.onDestroy(this.nodes);
  }

  return true;
};

PredictiveSearchComponent.prototype.clearAndClose = function () {
  this.nodes.input.value = "";
  this.close();
};

/**
 * Utilities
 */
function getTypeOf(value) {
  return Object.prototype.toString.call(value);
}

function isString(value) {
  return getTypeOf(value) === "[object String]";
}

function isBoolean(value) {
  return getTypeOf(value) === "[object Boolean]";
}

function isFunction(value) {
  return getTypeOf(value) === "[object Function]";
}

export default PredictiveSearchComponent;