/**
 * @jest-environment jsdom
 */
import {
  CountryProvinceSelector
} from '../theme-addresses';

import countryOptions from '../__fixtures__/all_country_options.txt';
import shippingCountryOptions from '../__fixtures__/shipping_country_options.txt';

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
});

describe('CountryProvinceSelector.build()', () => {
  test('populates the given country selectors when no default is set', () => {
    document.body.innerHTML = `<form>
      <select id="country"></select>
      <select id="province"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#country');
    const provinceSelector = document.querySelector('#province');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.querySelectorAll('option').length).not.toEqual(0);
    expect(countrySelector.value).toEqual('---');
    expect(countrySelector.querySelectorAll('option[value="Canada"]').length).toEqual(1);
  });

  test('populates the given country and province selectors when a default is set for country', () => {
    document.body.innerHTML = `<form>
      <select id="country" data-default="New Zealand"></select>
      <select id="province"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#country');
    const provinceSelector = document.querySelector('#province');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.value).toEqual('New Zealand');
    expect(provinceSelector.querySelectorAll('option').length).not.toEqual(0);
    expect(provinceSelector.value).toEqual('Auckland');
    expect(provinceSelector.querySelectorAll('option[value="Auckland"]').length).toEqual(1);
  });

  test('selects the first province in list if default value is not found as part of available options', () => {
    document.body.innerHTML = `<form>
      <select id="country" data-default="Canada"></select>
      <select id="province" data-default="Auckland"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#country');
    const provinceSelector = document.querySelector('#province');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.value).toEqual('Canada');
    expect(provinceSelector.querySelectorAll('option').length).not.toEqual(0);
    expect(provinceSelector.value).toEqual('Alberta');
  });

  test('populates the given country and province selectors when a default is set for country and province', () => {
    document.body.innerHTML = `<form>
      <select id="country" data-default="Canada"></select>
      <select id="province" data-default="Quebec"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#country');
    const provinceSelector = document.querySelector('#province');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.value).toEqual('Canada');
    expect(provinceSelector.value).toEqual('Quebec');
  });

  test('sets hideClass when provided', () => {
    document.body.innerHTML = `<form>
      <select id="country" data-default="Bahamas"></select>
      <select id="province"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#country');
    const provinceSelector = document.querySelector('#province');
  
    countryProvinceSelector.build(countrySelector, provinceSelector, {hideClass: 'hide'});

    expect(provinceSelector.classList.contains('hide')).toBeTruthy();
  });

  test('each pair of country province delectors should not interfere with each other', () => {
    document.body.innerHTML = `<form>
      <select id="country1" data-default="New Zealand"></select>
      <select id="province1"></select>
      <select id="country2" data-default="Canada"></select>
      <select id="province2"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector1 = document.querySelector('#country1');
    const provinceSelector1 = document.querySelector('#province1');
    const countrySelector2 = document.querySelector('#country2');
    const provinceSelector2 = document.querySelector('#province2');
  
    countryProvinceSelector.build(countrySelector1, provinceSelector1);
    countryProvinceSelector.build(countrySelector2, provinceSelector2);

    expect(provinceSelector1.querySelectorAll('option[value="Auckland"]').length).toEqual(1);
    expect(provinceSelector2.querySelectorAll('option[value="Quebec"]').length).toEqual(1);

    countrySelector2.value = 'New Zealand'
    countrySelector2.dispatchEvent(new Event('change'));

    expect(provinceSelector1.querySelectorAll('option[value="Auckland"]').length).toEqual(1);
    expect(provinceSelector2.querySelectorAll('option[value="Auckland"]').length).toEqual(1);

    countrySelector1.value = 'Canada'
    countrySelector1.dispatchEvent(new Event('change'));

    expect(provinceSelector1.querySelectorAll('option[value="Quebec"]').length).toEqual(1);
    expect(provinceSelector2.querySelectorAll('option[value="Auckland"]').length).toEqual(1);
  });

  test('different country options should populate base on the given CountryProvinceSelector instance', () => {
    document.body.innerHTML = `<form>
      <select id="billingCountry"></select>
      <select id="billingProvince"></select>
      <select id="shippingCountry"></select>
      <select id="shippingProvince"></select>
    </form>`;

    const billingCountryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const shippingCountryProvinceSelector = new CountryProvinceSelector(shippingCountryOptions);
    const billingCountrySelector = document.querySelector('#billingCountry');
    const billingProvinceSelector = document.querySelector('#billingProvince');
    const shippingCountrySelector = document.querySelector('#shippingCountry');
    const shippingProvinceSelector = document.querySelector('#shippingProvince');
  
    billingCountryProvinceSelector.build(billingCountrySelector, billingProvinceSelector);
    shippingCountryProvinceSelector.build(shippingCountrySelector, shippingProvinceSelector);

    expect(billingCountrySelector.querySelectorAll('option[value="Ireland"]').length).toEqual(1);
    expect(shippingCountrySelector.querySelectorAll('option[value="Canada"]').length).toEqual(1);
    expect(shippingCountrySelector.querySelectorAll('option[value="Ireland"]').length).toEqual(0);
  });
});
