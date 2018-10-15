/**
 * @jest-environment jsdom
 */

import {
  setSelectorByValue,
  postLink,
  CountryProvinceSelector,
} from '../theme-addresses';
import countryOptionTags from '../__fixtures__/all-country-option-tags';

function setupCountryProvinceSelectors() {
  document.body.innerHTML = `
    <select id="country" data-default="Mexico">
      <option data-provinces='[["Alberta","Alberta"],["Ontario","Ontario"],["British Columbia","British Columbia"]]' value="Canada">Canada</option>
      <option data-provinces='[["Aguascalientes","Aguascalientes"],["Nuevo León","Nuevo León"],["Sonora","Sonora"]]' value="Mexico">Mexico</option>
      <option data-provinces="[]" value="United Kingdom">United Kingdom</option>
    </select>
    <div id="province-container" style="display: none;">
      <select id="province" data-default="Nuevo León"></select>
    </div>
  `;
}

describe('setSelectorByValue', () => {
  beforeEach(setupCountryProvinceSelectors);

  test('sets a given selector with value', () => {
    const countryEl = document.getElementById('country');

    expect(setSelectorByValue(countryEl, 'Canada')).toBe(0);
    expect(countryEl.value).toBe('Canada');
  });
});

describe('postLink', () => {
  const oldXMLHttpRequest = window.XMLHttpRequest;
  const open = jest.fn();
  const send = jest.fn();
  const path = '/account/addresses/23';
  const options = {
    parameters: {_method: 'delete'},
  };

  beforeEach(() => {
    window.XMLHttpRequest = jest.fn(() => ({open, send}));
  });

  afterEach(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
  });

  it ('performs a POST request with XHR', () => {
    postLink(path, options);

    expect(window.XMLHttpRequest.mock.instances.length).toBe(1);
    expect(open).toHaveBeenCalledWith('POST', path, true);
    expect(send).toHaveBeenCalled();
  })
});

describe('CountryProvinceSelector', () => {
  beforeEach(setupCountryProvinceSelectors);

  test('populates the country selector', () => {
    document.body.innerHTML = `
      <select id="country" data-default="Canada"></select>
      <div id="province-container" style="display: none;">
        <select id="province" data-default="Ontario"></select>
      </div>
    `;

    const countryEl = document.getElementById('country');
    // eslint-disable-next-line no-unused-vars
    const countryProvinceSelector = new CountryProvinceSelector('country', 'province', {
      countryOptionTags,
    });

    expect(countryEl.options.length).toBe(2);
  });

  test('sets the initial value of country selector', () => {
    const countryEl = document.getElementById('country');
    // eslint-disable-next-line no-unused-vars
    const countryProvinceSelector = new CountryProvinceSelector('country', 'province', {
      initialCountry: 'Canada',
    });

    expect(countryEl.value).toBe('Canada');
  });

  test('populates the province selector', () => {
    const provinceEl = document.getElementById('province');
    const provinceContainer = document.getElementById('province-container');
    // eslint-disable-next-line no-unused-vars
    const countryProvinceSelector = new CountryProvinceSelector('country', 'province', {
      hideElement: 'province-container',
    });

    expect(provinceEl.options.length).toBe(3);
    expect(provinceContainer.style.display).not.toBe('none');
  });

  test('sets the initial value of the province selector', () => {
    const provinceEl = document.getElementById('province');
    // eslint-disable-next-line no-unused-vars
    const countryProvinceSelector = new CountryProvinceSelector('country', 'province', {
      initialProvince: 'Sonora',
    });

    expect(provinceEl.value).toBe('Sonora');
  });

  test('hides the province container when there are no provinces', () => {
    const countryEl = document.getElementById('country');
    const provinceEl = document.getElementById('province');
    const provinceContainer = document.getElementById('province-container');
    const event = document.createEvent('HTMLEvents');
    // eslint-disable-next-line no-unused-vars
    const countryProvinceSelector = new CountryProvinceSelector('country', 'province', {
      hideElement: 'province-container',
    });

    setSelectorByValue(countryEl, 'United Kingdom')
    event.initEvent('change', true, false);
    countryEl.dispatchEvent(event);

    expect(provinceEl.options.length).toBe(0);
    expect(provinceContainer.style.display).toBe('none');
  });
});
