export function validate(product) {}

export function getVariant(product, value) {
  let variant;

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

    if (indexOption === -1) {
      throw Error(`Invalid option name, ${option.name}`);
    }

    optionArray[indexOption] = option.value;
  });

  return optionArray;
}

function _getVariantFromId(product, id) {
  if (typeof product === "object") {
    return product.variants
      .filter(function(variant) {
        return variant.id === id;
      })
      .shift();
  }
  return false;
}

function _getVariantFromOptionCollection(product, collection, closest) {
  var optionArray = optionArrayFromOptionCollection(product, collection);
  return _getVariantFromOptionArray(product, optionArray, closest);
}

function _getVariantFromOptionArray(product, options) {
  var test = product.variants
    .filter(function(variant) {
      return options.every(function(option, index) {
        return variant.options[index] === option;
      });
    })
    .shift();

  return test;
}
