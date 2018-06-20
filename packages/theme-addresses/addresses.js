/*
 * Shopify Addresses
 * ------------------------------------------------------------------------------
 * Contains useful functions that can be used in addresses.liquid
 */

// set a given selector with value, if value is one of the options
export function setSelectorByValue(selector, value) {
  for (let i = 0, count = selector.options.length; i < count; i++) {
    const option = selector.options[i];
    if (value === option.value || value === option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
  return -1;
}

// send request as a POST
export function postLink(path, options = {}) {
  const method = options.method || 'post';
  const params = options.parameters || {};

  const form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', key);
      hiddenField.setAttribute('value', params[key]);
      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/* CountryProvinceSelector
 * js class that adds listener to country selector and on change updates
 * province selector with valid province values.
 * Selector should be in this format:
 *
 *   <select id="country_selector" name="country" data-default="Canada">
 *     <option data-provinces="[['Alberta','Alberta'],['Ontario','Ontario'],['British Columbia','British Columbia'],...] value="Canada">Canada</option>
 *     ...
 *   </select>
 *   <select id="province_selector" name="province" data-default="Ontario">
 *     <option value="Ontario">Ontario</option>
 *     ...
 *   </select>
 */
export class CountryProvinceSelector {
  constructor(countryDomId, provinceDomId, options) {
    this.countryEl = document.getElementById(countryDomId);
    this.provinceEl = document.getElementById(provinceDomId);
    this.provinceContainer = document.getElementById(options.hideElement || provinceDomId);

    this.countryEl.addEventListener('change', this.countryHandler.bind(this));

    this.initCountry();
    this.initProvince();
  }

  initCountry() {
    const value = this.countryEl.getAttribute('data-default');
    setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  }

  initProvince() {
    const value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      setSelectorByValue(this.provinceEl, value);
    }
  }

  countryHandler() {
    const opt = this.countryEl.options[this.countryEl.selectedIndex];
    const raw = opt.getAttribute('data-provinces');
    const provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length === 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      this.setOptions(this.provinceEl, provinces);
      this.provinceContainer.style.display = '';
    }
  }

  clearOptions(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  setOptions(selector, values) {
    for (let i = 0; i < values.length; i++) {
      const opt = document.createElement('option');
      opt.value = values[i][0];
      opt.innerHTML = values[i][1];
      selector.appendChild(opt);
    }
  }
}
