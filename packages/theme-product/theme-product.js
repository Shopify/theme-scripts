/**
 * Creates an array of selected options from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 *
 * @param {Object} product Product JSON object
 * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
 */
export function createOptionArrayFromOptionCollection(product, collection) {
  _validateProductStructure(product);

  var optionArray = [];
  var indexOption = -1;

  if (!Array.isArray(collection)) {
    throw new TypeError(`${collection} is not an array.`);
  }

  collection.forEach(option => {
    if (typeof option.name !== 'string') {
      throw new TypeError(
        `Invalid value type passed for name of option ${indexOption}. Value should be string.`
      );
    }

    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        indexOption = i;
        break;
      }
    }

    if (indexOption !== -1) {
      optionArray[indexOption] = option.value;
    }
  });

  return optionArray;
}

/**
 * Find a match in the project JSON (using Object "id" key or string/number directly) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {*} value Accepts String/Number (e.g. 6908023078973) or Object with "id" key (e.g. { id: 6908198649917 })
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
export function getVariantFromId(product, value) {
  _validateProductStructure(product);

  var isId = typeof value === 'string' || typeof value === 'number';
  var isObjectWithId =
    typeof value === 'object' && typeof value.id === 'number';

  if (isId || isObjectWithId) {
    var result = product.variants.filter(function(variant) {
      return variant.id === value;
    });

    return _getVariantSuccessCriteriaObject(result);
  }

  return {};
}

/**
 * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
export function getVariantFromOptionCollection(product, collection) {
  _validateProductStructure(product);

  if (Array.isArray(collection) && typeof collection[0] === 'object') {
    // If value is an array of options
    var optionArray = createOptionArrayFromOptionCollection(
      product,
      collection
    );
    return getVariantFromOptionArray(product, optionArray);
  }

  return {};
}

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
export function getVariantFromOptionArray(product, options) {
  _validateProductStructure(product);

  if (Array.isArray(options) && typeof options[0] !== 'object') {
    var result = product.variants.filter(function(variant) {
      return options.every(function(option, index) {
        return variant.options[index] === option;
      });
    });

    return _getVariantSuccessCriteriaObject(result);
  }

  return {};
}

/**
 * Check if the array found successful criterias
 * @param {Array} arr Array of object - [{ id: 6908023078973, product_id: 520670707773 }]
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
function _getVariantSuccessCriteriaObject(arr) {
  if (arr.length > 0) {
    return arr.shift();
  }

  return {};
}

/**
 * Check if the product data is a valid JS object
 * @param {Array} product Product JSON object
 * @returns {Boolean} True (boolean) if the structure is validated. Otherwise error will be thrown.
 */
function _validateProductStructure(product) {
  if (typeof product !== 'object') {
    throw new TypeError(`${product} is not an object.`);
  }

  if (Object.keys(product).length === 0) {
    throw Error(`${product} is empty.`);
  }

  return true;
}
