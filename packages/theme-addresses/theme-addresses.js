/**
 * CountryProvinceSelector Constructor
 * @param {String} countryOptions the country options in html string
 */
export function CountryProvinceSelector(countryOptions) {
  if (typeof countryOptions !== 'string') {
    throw new TypeError(countryOptions + ' is not a string.');
  }
  this.countryOptions = countryOptions;
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The <select> element for country
 * @param {Node} provinceNodeElement The <select> element for province
 * @param {Object} options Additional settings available
 * @param {CountryProvinceSelector~onCountryChange} options.onCountryChange callback after a country `change` event
 * @param {CountryProvinceSelector~onProvinceChange} options.onProvinceChange callback after a province `change` event
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement, options) {
  if (typeof countryNodeElement !== 'object') {
    throw new TypeError(countryNodeElement + ' is not a object.');
  }

  if (typeof provinceNodeElement !== 'object') {
    throw new TypeError(provinceNodeElement + ' is not a object.');
  }

  var defaultValue = countryNodeElement.getAttribute('data-default');
  options = options || {}

  countryNodeElement.innerHTML = this.countryOptions;
  countryNodeElement.value = defaultValue;

  if (defaultValue && getOption(countryNodeElement, defaultValue)) {
    var provinces = buildProvince(countryNodeElement, provinceNodeElement, defaultValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    
    var provinces = buildProvince(target, provinceNodeElement, selectedValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  });

  options.onProvinceChange && provinceNodeElement.addEventListener('change', options.onProvinceChange);
}

/**
 * This callback is called after a user interacted with a country `<select>`
 * @callback CountryProvinceSelector~onCountryChange
 * @param {array} provinces the parsed provinces
 * @param {Node} provinceNodeElement province `<select>` element
 * @param {Node} countryNodeElement country `<select>` element
 */

 /**
 * This callback is called after a user interacted with a province `<select>`
 * @callback CountryProvinceSelector~onProvinceChange
 * @param {Event} event the province selector `change` event object
 */

/**
 * Returns the <option> with the specified value from the
 * given node element
 * A null is returned if no such <option> is found
 */
function getOption(nodeElement, value) {
  return nodeElement.querySelector('option[value="' + value +'"]')
}

/**
 * Builds the options for province selector
 */
function buildOptions (provinceNodeElement, provinces) {
  var defaultValue = provinceNodeElement.getAttribute('data-default');

  provinces.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option[0];
    optionElement.textContent = option[1];

    provinceNodeElement.appendChild(optionElement);
  })

  if (defaultValue && getOption(provinceNodeElement, defaultValue)) {
    provinceNodeElement.value = defaultValue;
  }
}

/**
 * Builds the province selector
 */
function buildProvince (countryNodeElement, provinceNodeElement, selectedValue) {
  var selectedOption = getOption(countryNodeElement, selectedValue);
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));

  provinceNodeElement.options.length = 0;

  if (provinces.length) {
    buildOptions(provinceNodeElement, provinces)
  }

  return provinces;
}
