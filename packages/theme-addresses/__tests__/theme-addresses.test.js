/**
 * @jest-environment jsdom
 */
import {
  CountryProvinceSelector
} from '../theme-addresses';

const countryOptions = '<option value="---" data-provinces="[]">---</option>' +
  '<option value="Bahamas" data-provinces="[]">Bahamas</option>' +
  '<option value="Canada" data-provinces="[[&quot;Alberta&quot;,&quot;Alberta&quot;],[&quot;British Columbia&quot;,&quot;British Columbia&quot;],[&quot;Manitoba&quot;,&quot;Manitoba&quot;],[&quot;New Brunswick&quot;,&quot;New Brunswick&quot;],[&quot;Newfoundland&quot;,&quot;Newfoundland and Labrador&quot;],[&quot;Northwest Territories&quot;,&quot;Northwest Territories&quot;],[&quot;Nova Scotia&quot;,&quot;Nova Scotia&quot;],[&quot;Nunavut&quot;,&quot;Nunavut&quot;],[&quot;Ontario&quot;,&quot;Ontario&quot;],[&quot;Prince Edward Island&quot;,&quot;Prince Edward Island&quot;],[&quot;Quebec&quot;,&quot;Quebec&quot;],[&quot;Saskatchewan&quot;,&quot;Saskatchewan&quot;],[&quot;Yukon&quot;,&quot;Yukon&quot;]]">Canada</option>' +
  '<option value="New Zealand" data-provinces="[[&quot;Auckland&quot;,&quot;Auckland&quot;],[&quot;Bay of Plenty&quot;,&quot;Bay of Plenty&quot;],[&quot;Canterbury&quot;,&quot;Canterbury&quot;],[&quot;Gisborne&quot;,&quot;Gisborne&quot;],[&quot;Hawke&#39;s Bay&quot;,&quot;Hawke&#39;s Bay&quot;],[&quot;Manawatu-Wanganui&quot;,&quot;Manawatu-Wanganui&quot;],[&quot;Marlborough&quot;,&quot;Marlborough&quot;],[&quot;Nelson&quot;,&quot;Nelson&quot;],[&quot;Northland&quot;,&quot;Northland&quot;],[&quot;Otago&quot;,&quot;Otago&quot;],[&quot;Southland&quot;,&quot;Southland&quot;],[&quot;Taranaki&quot;,&quot;Taranaki&quot;],[&quot;Tasman&quot;,&quot;Tasman&quot;],[&quot;Waikato&quot;,&quot;Waikato&quot;],[&quot;Wellington&quot;,&quot;Wellington&quot;],[&quot;West Coast&quot;,&quot;West Coast&quot;]]">New Zealand</option>';

const shippingCountryOptions = '<option value="---" data-provinces="[]">---</option>' +
  '<option value="France" data-provinces="[]">France</option>' +
  '<option value="United Kingdom" data-provinces="[]">United Kingdom</option>';

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
    const countrySelector = document.querySelector('#addressTestCountry');
    const provinceSelector = document.querySelector('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.querySelectorAll('option').length).not.toEqual(0);
    expect(countrySelector.value).toEqual('---');
    expect(countrySelector.querySelectorAll('option[value="Canada"]').length).toEqual(1);
  });

  test('populates the given country and province selectors when a default is set for country', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="New Zealand"></select>
      <select id="addressTestProvince"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#addressTestCountry');
    const provinceSelector = document.querySelector('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.value).toEqual('New Zealand');
    expect(provinceSelector.querySelectorAll('option').length).not.toEqual(0);
    expect(provinceSelector.value).toEqual('---');
    expect(provinceSelector.querySelectorAll('option[value="Quebec"]').length).toEqual(1);
  });

  test('populates the given country and province selectors when a default is set for country and province', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="Canada"></select>
      <select id="addressTestProvince" data-default="Quebec"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#addressTestCountry');
    const provinceSelector = document.querySelector('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector, provinceSelector);

    expect(countrySelector.value).toEqual('Canada');
    expect(provinceSelector.value).toEqual('Quebec');
  });

  test('sets hideClass when provided', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry" data-default="Bahamas"></select>
      <select id="addressTestProvince"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector = document.querySelector('#addressTestCountry');
    const provinceSelector = document.querySelector('#addressTestProvince');
  
    countryProvinceSelector.build(countrySelector, provinceSelector, {hideClass: 'hide'});

    expect(provinceSelector.classList.contains('hide')).toEqual(true);
  });

  test('each pair of country province delectors should not interfer with each other', () => {
    document.body.innerHTML = `<form>
      <select id="addressTestCountry1" data-default="New Zealand"></select>
      <select id="addressTestProvince1"></select>
      <select id="addressTestCountry2" data-default="Canada"></select>
      <select id="addressTestProvince2"></select>
    </form>`;

    const countryProvinceSelector = new CountryProvinceSelector(countryOptions);
    const countrySelector1 = document.querySelector('#addressTestCountry1');
    const provinceSelector1 = document.querySelector('#addressTestProvince1');
    const countrySelector2 = document.querySelector('#addressTestCountry2');
    const provinceSelector2 = document.querySelector('#addressTestProvince2');
  
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
});
