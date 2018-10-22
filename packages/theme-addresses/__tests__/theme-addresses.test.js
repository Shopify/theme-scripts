/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
import {
  CountryProvinceSelector
} from '../theme-addresses';

const countryOptions = '<option value="---" data-provinces="[]">---</option>' +
  '<option value="Bahamas" data-provinces="[]">Bahamas</option>' +
  '<option value="Canada" data-provinces="[[&quot;Alberta&quot;,&quot;Alberta&quot;],[&quot;British Columbia&quot;,&quot;British Columbia&quot;],[&quot;Manitoba&quot;,&quot;Manitoba&quot;],[&quot;New Brunswick&quot;,&quot;New Brunswick&quot;],[&quot;Newfoundland&quot;,&quot;Newfoundland and Labrador&quot;],[&quot;Northwest Territories&quot;,&quot;Northwest Territories&quot;],[&quot;Nova Scotia&quot;,&quot;Nova Scotia&quot;],[&quot;Nunavut&quot;,&quot;Nunavut&quot;],[&quot;Ontario&quot;,&quot;Ontario&quot;],[&quot;Prince Edward Island&quot;,&quot;Prince Edward Island&quot;],[&quot;Quebec&quot;,&quot;Quebec&quot;],[&quot;Saskatchewan&quot;,&quot;Saskatchewan&quot;],[&quot;Yukon&quot;,&quot;Yukon&quot;]]">Canada</option>';

describe('CountryProvinceSelector', () => {
  test('is a function exported by theme-addresses.js', () => {
    expect(typeof CountryProvinceSelector).toBe('function');
  });

  test('returns an object with a build function', () => {
    let countryProvinceSelector;
    expect(() => {
      countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    }).not.toThrow();
    expect(typeof countryProvinceSelector.build).toBe('function');
  });

  // Hmm ... how to validate the countryOptions that is being passed in is a valid html?
});

describe('CountryProvinceSelector.build()', () => {
  test('populates the given country selectors when no default is set', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry"></select>
      <select id="addressTestProvince"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = $('#addressTestCountry');
    const provinceSelector = $('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector[0], provinceSelector[0]);

    expect(countrySelector.find('option').length).not.toEqual(0);
    expect(countrySelector[0].value).toEqual('---');
  });

  test('populates the given country and province selectors when a default is set for country', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="Canada"></select>
      <select id="addressTestProvince"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = $('#addressTestCountry');
    const provinceSelector = $('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector[0], provinceSelector[0]);

    expect(countrySelector[0].value).toEqual('Canada');
    expect(provinceSelector.find('option').length).not.toEqual(0);
  });

  test('populates the given country and province selectors when a default is set for country and province', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="Canada"></select>
      <select id="addressTestProvince" data-default="Quebec"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = $('#addressTestCountry');
    const provinceSelector = $('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector[0], provinceSelector[0]);

    expect(countrySelector[0].value).toEqual('Canada');
    expect(provinceSelector[0].value).toEqual('Quebec');
  });

  test('sets hideClass when provided', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="Bahamas"></select>
      <select id="addressTestProvince"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = $('#addressTestCountry');
    const provinceSelector = $('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector[0], provinceSelector[0], {hideClass: 'hide'});

    expect(provinceSelector[0].classList.contains('hide')).toEqual(true);
  });
});
