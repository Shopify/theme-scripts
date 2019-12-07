import {loadCountries} from './loader';
import {mergeObjects} from './helpers';

var FIELD_REGEXP = /({\w+})/g;
var LINE_DELIMITER = '_';
var INPUT_SELECTORS = {
  lastName: '[name="address[last_name]"]',
  firstName: '[name="address[first_name]"]',
  company: '[name="address[company]"]',
  address1: '[name="address[address1]"]',
  address2: '[name="address[address2]"]',
  country: '[name="address[country]"]',
  zone: '[name="address[province]"]',
  postalCode: '[name="address[zip]"]',
  city: '[name="address[city]"]',
  phone: '[name="address[phone]"]',
};

export default function AddressForm(rootEl, locale, options) {
  locale = locale || 'en';
  options = options || {inputSelectors: {}};
  var formElements = loadFormElements(
    rootEl,
    mergeObjects(INPUT_SELECTORS, options.inputSelectors)
  );

  validateElements(formElements);

  return loadShippingCountries(options.shippingCountriesOnly).then(function(
    shippingCountryCodes
  ) {
    return loadCountries(locale).then(function(countries) {
      init(
        rootEl,
        formElements,
        filterCountries(countries, shippingCountryCodes)
      );
    });
  });
}

/**
 * Runs when countries have been loaded
 */
function init(rootEl, formElements, countries) {
  populateCountries(formElements, countries);
  var selectedCountry = formElements.country.input
    ? formElements.country.input.value
    : null;
  setEventListeners(rootEl, formElements, countries);
  handleCountryChange(rootEl, formElements, selectedCountry, countries);
}

/**
 * Handles when a country change: set labels, reorder fields, populate zones
 */
function handleCountryChange(rootEl, formElements, countryCode, countries) {
  var country = getCountry(countryCode, countries);

  setLabels(formElements, country);
  reorderFields(rootEl, formElements, country);
  populateZones(formElements, country);
}

/**
 * Sets up event listener for country change
 */
function setEventListeners(rootEl, formElements, countries) {
  formElements.country.input.addEventListener('change', function(event) {
    handleCountryChange(rootEl, formElements, event.target.value, countries);
  });
}

/**
 * Reorder fields in the DOM and add data-attribute to fields given a country
 */
function reorderFields(rootEl, formElements, country) {
  var formFormat = country.formatting.edit;

  var countryWrapper = formElements.country.wrapper;
  var afterCountry = false;

  getOrderedField(formFormat).forEach(function(row) {
    row.forEach(function(line) {
      formElements[line].wrapper.dataset.lineCount = row.length;
      if (!formElements[line].wrapper) {
        return;
      }
      if (line === 'country') {
        afterCountry = true;
        return;
      }

      if (afterCountry) {
        rootEl.append(formElements[line].wrapper);
      } else {
        rootEl.insertBefore(formElements[line].wrapper, countryWrapper);
      }
    });
  });
}

/**
 * Update labels for a given country
 */
function setLabels(formElements, country) {
  Object.keys(formElements).forEach(function(formElementName) {
    formElements[formElementName].labels.forEach(function(label) {
      label.textContent = country.labels[formElementName];
    });
  });
}

/**
 * Add right countries in the dropdown for a given country
 */
function populateCountries(formElements, countries) {
  var countrySelect = formElements.country.input;
  var duplicatedCountrySelect = countrySelect.cloneNode(true);
  var countryCodeKey = [];

  countries.forEach(function(country) {
    var optionElement = document.createElement('option');
    optionElement.value = country.code;
    optionElement.textContent = country.name;
    duplicatedCountrySelect.appendChild(optionElement);
    countryCodeKey[country.name] = country.code;
  });

  countrySelect.innerHTML = duplicatedCountrySelect.innerHTML;

  if (countrySelect.dataset.default) {
    var defaultValue = countrySelect.dataset.default;

    if (defaultValue.length > 2 && countryCodeKey.hasOwnProperty(defaultValue)) {
      defaultValue = countryCodeKey[defaultValue];
    }

    countrySelect.value = defaultValue;
  }
}

/**
 * Add right zones in the dropdown for a given country
 */
function populateZones(formElements, country) {
  var zoneEl = formElements.zone;
  if (!zoneEl) {
    return;
  }

  if (country.zones.length === 0) {
    zoneEl.wrapper.dataset.ariaHidden = 'true';
    zoneEl.input.innerHTML = '';
    return;
  }

  zoneEl.wrapper.dataset.ariaHidden = 'false';

  var zoneSelect = zoneEl.input;
  var duplicatedZoneSelect = zoneSelect.cloneNode(true);
  duplicatedZoneSelect.innerHTML = '';
  var zoneCodeKey = [];

  country.zones.forEach(function(zone) {
    var optionElement = document.createElement('option');
    optionElement.value = zone.code;
    optionElement.textContent = zone.name;
    duplicatedZoneSelect.appendChild(optionElement);
    zoneCodeKey[zone.name] = zone.code;
  });

  zoneSelect.innerHTML = duplicatedZoneSelect.innerHTML;

  if (zoneSelect.dataset.default) {
    var defaultValue = zoneSelect.dataset.default;

    if (defaultValue.length > 2 && zoneCodeKey.hasOwnProperty(defaultValue)) {
      defaultValue = zoneCodeKey[defaultValue];
    }

    zoneSelect.value = defaultValue;
  }
}

/**
 * Will throw if an input or a label is missing from the wrapper
 */
function validateElements(formElements) {
  Object.keys(formElements).forEach(function(elementKey) {
    var element = formElements[elementKey].input;
    var labels = formElements[elementKey].labels;

    if (!element) {
      return;
    }

    if (typeof element !== 'object') {
      throw new TypeError(
        formElements[elementKey] + ' is missing an input or select.'
      );
    } else if (typeof labels !== 'object') {
      throw new TypeError(formElements[elementKey] + ' is missing a label.');
    }
  });
}

/**
 * Given an countryCode (eg. 'CA'), will return the data of that country
 */
function getCountry(countryCode, countries) {
  countryCode = countryCode || 'CA';
  return countries.filter(function(country) {
    return country.code === countryCode;
  })[0];
}

/**
 * Given a format (eg. "{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}")
 * will return an array of how the form needs to be formatted, eg.:
 * =>
 * [
 *   ['firstName', 'lastName'],
 *   ['company'],
 *   ['address1'],
 *   ['address2'],
 *   ['city'],
 *   ['country', 'province', 'zip'],
 *   ['phone']
 * ]
 */
function getOrderedField(format) {
  return format.split(LINE_DELIMITER).map(function(fields) {
    var result = fields.match(FIELD_REGEXP);
    if (!result) {
      return [];
    }

    return result.map(function(fieldName) {
      var newFieldName = fieldName.replace(/[{}]/g, '');

      switch (newFieldName) {
        case 'zip':
          return 'postalCode';
        case 'province':
          return 'zone';
        default:
          return newFieldName;
      }
    });
  });
}

/**
 * Given a rootEl where all `input`s, `select`s, and `labels` are nested, it
 * will returns all form elements (wrapper, input and labels) of the form.
 * See `FormElements` type for details
 */
function loadFormElements(rootEl, inputSelectors) {
  var elements = {};
  Object.keys(INPUT_SELECTORS).forEach(function(inputKey) {
    var input = rootEl.querySelector(inputSelectors[inputKey]);
    elements[inputKey] = input
      ? {
          wrapper: input.parentElement,
          input: input,
          labels: document.querySelectorAll('[for="' + input.id + '"]'),
        }
      : {};
  });

  return elements;
}

/**
 * If shippingCountriesOnly is set to true, will return the list of countries the
 * shop ships to. Otherwise returns null.
 */
function loadShippingCountries(shippingCountriesOnly) {
  if (!shippingCountriesOnly) {
    // eslint-disable-next-line no-undef
    return Promise.resolve(null);
  }

  var response = fetch(location.origin + '/meta.json');

  return response
    .then(function(res) {
      return res.json();
    })
    .then(function(meta) {
      // If ships_to_countries has * in the list, it means the shop ships to
      // all countries
      return meta.ships_to_countries.indexOf('*') !== -1
        ? null
        : meta.ships_to_countries;
    })
    .catch(function() {
      return null;
    });
}

/**
 * Only returns countries that are in includedCountryCodes
 * Returns all countries if no includedCountryCodes is passed
 */
function filterCountries(countries, includedCountryCodes) {
  if (!includedCountryCodes) {
    return countries;
  }

  return countries.filter(function(country) {
    return includedCountryCodes.indexOf(country.code) !== -1;
  });
}
