/**
 * @jest-environment jsdom
 */
import 'isomorphic-fetch';

import fetchMock from 'fetch-mock';

import {AddressForm} from '../theme-addresses';

import formHtml from '../__fixtures__/form.html';
import customFormHtml from '../__fixtures__/custom_form.html';
import countries from '../__fixtures__/countries.json';
import meta from '../__fixtures__/meta.json';

describe('AddressForm', () => {
  beforeAll(() => {
    fetchMock.mock(
      'https://country-service.shopifycloud.com/graphql',
      countries
    );

    fetchMock.mock('http://localhost/meta.json', meta);
  });

  describe('with no custom options', () => {
    let countrySelect;

    beforeEach(loaded => {
      document.body.innerHTML = formHtml;
      countrySelect = document.body.querySelector('[name="address[country]"]');
      // eslint-disable-next-line promise/catch-or-return
      AddressForm(
        document.body.querySelector('[data-address="root"]'),
        'en'
      ).then(loaded);
    });

    test('use [data-default] country value if set in the DOM', () => {
      const provinceSelect = document.body.querySelector(
        '[name="address[province]"]'
      );

      expect(countrySelect.value).toEqual('JP');
      expect(provinceSelect.value).toEqual('JP-04');
    });

    test('reorders field correctly', () => {
      countrySelect.value = 'CA';
      countrySelect.dispatchEvent(new Event('change'));

      let inputs = [
        ...document.body.querySelectorAll(
          '[data-address=root] [name^=address]'
        ),
      ];
      let order = inputs.map(input => input.name);

      expect(order).toEqual([
        'address[first_name]',
        'address[last_name]',
        'address[company]',
        'address[address1]',
        'address[address2]',
        'address[city]',
        'address[country]',
        'address[province]',
        'address[zip]',
        'address[phone]',
      ]);

      countrySelect.value = 'FR';
      countrySelect.dispatchEvent(new Event('change'));

      inputs = [
        ...document.body.querySelectorAll(
          '[data-address=root] [name^=address]'
        ),
      ];
      order = inputs.map(input => input.name);
      expect(order).toEqual([
        'address[first_name]',
        'address[last_name]',
        'address[company]',
        'address[address1]',
        'address[address2]',
        'address[zip]',
        'address[city]',
        'address[country]',
        'address[province]',
        'address[phone]',
      ]);
    });

    test('replaces labels depending of the country', () => {
      const address2Label = document.body.querySelector(
        '[for="AddressAddress2"]'
      );

      countrySelect.value = 'CA';
      countrySelect.dispatchEvent(new Event('change'));
      expect(address2Label.textContent).toEqual('Apt./Unit No.');

      countrySelect.value = 'FR';
      countrySelect.dispatchEvent(new Event('change'));
      expect(address2Label.textContent).toEqual('Apartment, suite, etc.');
    });

    test('provinces are correctly populated depending of the country', () => {
      const provinceSelect = document.body.querySelector(
        '[name="address[province]"]'
      );

      countrySelect.value = 'CA';
      countrySelect.dispatchEvent(new Event('change'));
      expect(provinceSelect.value).toEqual('AB');

      countrySelect.value = 'US';
      countrySelect.dispatchEvent(new Event('change'));
      expect(provinceSelect.value).toEqual('AL');
    });

    test('provinces select is hidden if country does not have any', () => {
      const provinceWrapper = document.body.querySelector(
        '[data-province-wrapper]'
      );
      const provinceSelect = document.body.querySelector(
        '[name="address[province]"]'
      );

      countrySelect.value = 'FR';
      countrySelect.dispatchEvent(new Event('change'));
      expect(provinceWrapper.dataset.ariaHidden).toBeTruthy();
      expect(provinceSelect.options.length).toEqual(0);
    });
  });

  describe('with custom options', () => {
    let customCountrySelect;

    beforeEach(loaded => {
      document.body.innerHTML = customFormHtml;
      // eslint-disable-next-line promise/catch-or-return
      AddressForm(document.body.querySelector('[data-address="root"]'), 'en', {
        shippingCountriesOnly: true,
        inputSelectors: {
          country: '#CustomAddressCountry',
        },
      }).then(loaded);
      customCountrySelect = document.body.querySelector(
        '#CustomAddressCountry'
      );
    });

    test('use overriden inputSelectors if passed', () => {
      customCountrySelect.value = 'FR';
      customCountrySelect.dispatchEvent(new Event('change'));
      const provinceWrapper = document.body.querySelector(
        '[data-province-wrapper]'
      );

      const provinceSelect = document.body.querySelector(
        '[name="address[province]"]'
      );

      expect(provinceWrapper.dataset.ariaHidden).toBeTruthy();
      expect(provinceSelect.options.length).toEqual(0);
      expect(provinceSelect.options.length).toEqual(0);
      expect(customCountrySelect.options.length).toEqual(2);
    });

    test('only shows shipping countries if option shippingCountriesOnly is true', () => {
      expect(customCountrySelect.options.length).toEqual(2);
    });
  });
});
