export function validate(product) {}

export function getVariant(product, value) {
  let variant;

  if (typeof value === "string" || typeof value === "number") {
    // If value is an id
    variant = _getVariantFromId(product, value);
  } else if (typeof value === "object" && typeof value.id === "number") {
    // If value is a variant object containing an id key
    variant = _getVariantFromId(product, value.id);
  } else if (isArray(value)) {
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

export function optionArrayFromOptionCollection(product, collection) {}

function _getVariantFromId(product, id) {
  //   return find(product.variants, { id });
  if (Array.isArray(product)) {
    return product.variants
      .filter(function(variant) {
        return variant.id === id;
      })
      .shift();
  }
  return false;
}

function _getVariantFromOptionCollection(product, collection, closest) {}

function _getVariantFromOptionArray(product, options) {}
