export function setSelectorByValue(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];

    if (value === option.value || value === option.innerHTML) {
      return selector.selectedIndex = i;
    }
  }
}

export function postLink(path, options) {
  options = options || {};

  var method = options.method || 'POST';
  var params = options.parameters || {};
  var formData = new FormData();
  var request = new XMLHttpRequest();

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }

  request.open(method, path, true);
  request.send(formData);
}

export function CountryProvinceSelector(countryDomId, provinceDomId, options) {
  this.options = options || {};
  this.countryEl = document.getElementById(countryDomId);
  this.provinceEl = document.getElementById(provinceDomId);
  this.provinceContainer = document.getElementById(this.options.hideElement || provinceDomId);

  this.initCountry();
  this.initProvince();

  this.countryEl.addEventListener('change', this.handleCountryChange.bind(this));
}

CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.options.initialCountry || this.countryEl.getAttribute('data-default');

    this.populateCountrySelect();
    setSelectorByValue(this.countryEl, value);
    this.handleCountryChange();
  },

  initProvince: function() {
    var value = this.options.initialProvince || this.provinceEl.getAttribute('data-default');

    if (value && this.provinceEl.options.length > 0) {
      setSelectorByValue(this.provinceEl, value);
    }
  },

  populateCountrySelect: function() {
    var countryOptionTags = this.options.countryOptionTags;

    if (!countryOptionTags) {
      return;
    }

    this.countryEl.insertAdjacentHTML('afterbegin', countryOptionTags);
  },

  handleCountryChange: function() {
    var option = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = option.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);

    if (provinces && provinces.length === 0) {
      this.provinceContainer.style.display = 'none';
      return;
    }

    this.populateProvinceSelect(provinces);
    this.provinceContainer.style.display = '';
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  populateProvinceSelect: function(values) {
    for (var i = 0; i < values.length; i++) {
      var option = document.createElement('option');

      option.value = values[i][0];
      option.innerHTML = values[i][1];

      this.provinceEl.appendChild(option);
    }
  },
};
