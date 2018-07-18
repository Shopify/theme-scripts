/**
 * Search through the product object and return a variant
 *
 * @param {Object} product - Product JSON object
 * @param {*} value - The targeted value. It accepts :
 * - Strings/Number (e.g. 520670707773)
 * - Object with ID key (e.g. { id: 6908198649917 })
 * - Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * - Array of values: (e.g. ["38", "Black"])
 * @returns {Object} The variant object.
 */
export function getVariant(product, value) {
  let variant;

  if (typeof product !== "object") {
    throw Error(`${product} is not an object.`);
  }

  if (Object.keys(product).length === 0) {
    throw Error(`${product} is empty.`);
  }

  if (typeof value === "string" || typeof value === "number") {
    // If value is an id
    variant = _getVariantFromId(product, value);
  } else if (typeof value === "object" && typeof value.id === "number") {
    // If value is a variant object containing an id key
    variant = _getVariantFromId(product, value.id);
  } else if (Array.isArray(value)) {
    // If value is an array of options
    if (typeof value[0] === "object") {
      // If value is a collection of options with name and value keys
      variant = _getVariantFromOptionCollection(product, value);
    } else {
      // If value is an array of option values, ordered by index of array
      variant = _getVariantFromOptionArray(product, value);
    }
  }

  return variant;
}

/**
 * Creates an array of selected options from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 *
 * @param {Object} product - Product JSON object
 * @param {Array} collection - Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
 */
export function optionArrayFromOptionCollection(product, collection) {
  var optionArray = [];
  var indexOption = -1;

  collection.forEach(option => {
    if (typeof option.name !== "string") {
      throw Error(
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
 * @param {Object} product - Product JSON object
 * @param {*} id - Accepts String/Number (e.g. 6908023078973) or Object with "id" key (e.g. { id: 6908198649917 })
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
function _getVariantFromId(product, id) {
  var result = product.variants.filter(function(variant) {
    return variant.id === id;
  });

  return _getVariantSuccessCriteriaObject(result);
}

function _getVariantFromOptionCollection(product, collection) {
  var optionArray = optionArrayFromOptionCollection(product, collection);
  return _getVariantFromOptionArray(product, optionArray);
}

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product - Product JSON object
 * @param {Array} options - List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
function _getVariantFromOptionArray(product, options) {
  var result = product.variants.filter(function(variant) {
    return options.every(function(option, index) {
      return variant.options[index] === option;
    });
  });

  return _getVariantSuccessCriteriaObject(result);
}

/**
 * Check if the array found successful criterias
 * @param {Array} arr - Array of object - [{ id: 6908023078973, product_id: 520670707773 }]
 * @returns {Object} The variant object once a match has been successful. Otherwise an empty object will be returned
 */
function _getVariantSuccessCriteriaObject(arr) {
  if (arr.length > 0) {
    return arr.shift();
  }

  return {};
}
