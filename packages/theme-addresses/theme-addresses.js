/**
 * CountryProvinceSelector Constructor
 * @param {Object} countryOptions Country JSON object
 */
export function CountryProvinceSelector(countryOptions) {
  this.options = countryOptions
}

var buildProvince = function (provinceNodeElement, selectedOption) {
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));
  var defaultValue = provinceNodeElement.getAttribute('data-default');

  provinceNodeElement.innerHTML = provinces.map(function (option) {
    return '<option value="' + option[0] + '">' + option[1] + '</option>';
  }).join('');
  provinceNodeElement.value = defaultValue
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The select Node element for country
 * @param {Node} provinceNodeElement The select Node element for province
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement) {
  var defaultValue = countryNodeElement.getAttribute('data-default');

  countryNodeElement.innerHTML = this.options;
  countryNodeElement.value = defaultValue;

  if (defaultValue) {
    var selectedOption = countryNodeElement.querySelectorAll('option[value="' + defaultValue +'"]')[0];
    buildProvince(provinceNodeElement, selectedOption)
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    var selectedOption = target.querySelectorAll('option[value="' + selectedValue +'"]')[0];
    
    provinceNodeElement.value = null
    buildProvince(provinceNodeElement, selectedOption)
  });
}
