/**
 * CountryProvinceSelector Constructor
 * @param {Object} countryOptions Country JSON object
 */
export function CountryProvinceSelector(countryOptions) {
  this.countryOptions = countryOptions;
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The select Node element for country
 * @param {Node} provinceNodeElement The select Node element for province
 * @param {Object} options Additional settings available
 * @param {string} option.hideClass The classname that will be toggled for province selector
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement, options) {
  var defaultValue = countryNodeElement.getAttribute('data-default');
  options = options || {}

  countryNodeElement.innerHTML = this.countryOptions;
  countryNodeElement.value = defaultValue;
  options.hideClass && provinceNodeElement.classList.add(options.hideClass);

  if (defaultValue && getOption(countryNodeElement, defaultValue)) {
    buildProvince(countryNodeElement, provinceNodeElement, defaultValue, options);
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    
    buildProvince(target, provinceNodeElement, selectedValue, options);
  });
}

/**
 * Helper function - returns the <option> with the specified value from the
 * given node element
 * A null can be returned of no such <option> found
 */
function getOption(nodeElement, value) {
  return nodeElement.querySelector('option[value="' + value +'"]')
}

/**
 * Helper function - builds the province selector
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
 * Helper function - determines if province selector needs to be build
 */
function buildProvince (countryNodeElement, provinceNodeElement, selectedValue, options) {
  var selectedOption = getOption(countryNodeElement, selectedValue);
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));

  provinceNodeElement.options.length = 0;

  if (provinces.length) {
    buildOptions(provinceNodeElement, provinces)
    options.hideClass && provinceNodeElement.classList.remove(options.hideClass);
  } else {
    options.hideClass && provinceNodeElement.classList.add(options.hideClass);
  }
}
