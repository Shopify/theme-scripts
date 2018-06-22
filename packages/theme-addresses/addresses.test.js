import { setSelectorByValue, postLink, CountryProvinceSelector } from './addresses';

describe('setSelectorByValue', () => {
  let countryEl;

  beforeEach(() => {
    document.body.innerHTML = '<select id="country"><option value="Mexico"><option value="Canada"></select>';
    countryEl = document.getElementById('country');
  });

  test('sets a given selector with value and returns option index', () => {
    expect(setSelectorByValue(countryEl, 'Canada')).toBe(1);
    expect(countryEl.value).toBe('Canada');
  });

  test('returns -1 if value is not one of the options', () => {
    expect(setSelectorByValue(countryEl, 'United States')).toBe(-1);
    expect(countryEl.value).not.toBe('United States');
  });
});

describe('postLink', () => {
  let form;
  let input;
  let documentCreateElementSpy;
  let formSubmitSpy;

  beforeEach(() => {
    form = document.createElement('form');
    input = document.createElement('input');
    documentCreateElementSpy = jest.spyOn(document, 'createElement')
    formSubmitSpy = jest.spyOn(form, 'submit').mockReturnValueOnce(undefined);
  });

  test('creates a form element with action, method attributes', () => {
    documentCreateElementSpy.mockReturnValueOnce(form);

    const formSetAttributeSpy = jest.spyOn(form, 'setAttribute');

    postLink('/account/addresses/23', {parameters: {_method: 'delete'}});

    expect(documentCreateElementSpy).toBeCalledWith('form');

    expect(formSetAttributeSpy).toBeCalledWith('method', 'post');
    expect(formSetAttributeSpy).toBeCalledWith('action', '/account/addresses/23');
  });

  test('appends to the form a hidden input for each key in params', () => {
    documentCreateElementSpy
      .mockReturnValueOnce(form)
      .mockReturnValueOnce(input);

    const inputSetAttributeSpy = jest.spyOn(input, 'setAttribute');

    const formAppendChildSpy = jest.spyOn(form, 'appendChild');

    postLink('/account/addresses/23', {parameters: {_method: 'delete'}});

    expect(documentCreateElementSpy).toBeCalledWith('input');

    expect(inputSetAttributeSpy).toBeCalledWith('type', 'hidden');
    expect(inputSetAttributeSpy).toBeCalledWith('name', '_method');
    expect(inputSetAttributeSpy).toBeCalledWith('value', 'delete');

    expect(formAppendChildSpy).toBeCalledWith(input);
  });

  test('appends the form to the body', () => {
    documentCreateElementSpy.mockReturnValueOnce(form);

    const documentBodyAppendChildSpy = jest.spyOn(document.body, 'appendChild');

    postLink('/account/addresses/23', {parameters: {_method: 'delete'}});

    expect(documentBodyAppendChildSpy).toBeCalledWith(form);
  });

  test('submits the form', () => {
    documentCreateElementSpy.mockReturnValueOnce(form);

    const formSubmitSpy = jest.spyOn(form, 'submit');

    postLink('/account/addresses/23', {parameters: {_method: 'delete'}});

    expect(formSubmitSpy).toBeCalled();
  });

  test('removes the form from the body', () => {
    documentCreateElementSpy.mockReturnValueOnce(form);

    const documentBodyRemoveChildSpy = jest.spyOn(document.body, 'removeChild');

    postLink('/account/addresses/23', {parameters: {_method: 'delete'}});

    expect(documentBodyRemoveChildSpy).toBeCalledWith(form);
  });
});

describe('CountryProvinceSelector', () => {
  let countrySelector;
  let countryEl;
  let provinceEl;
  let provinceContainer;

  beforeEach(() => {
    document.body.innerHTML = `
      <select id="country" data-default="Mexico">
        <option data-provinces='[["Alberta","Alberta"],["Ontario","Ontario"],["British Columbia","British Columbia"]]' value="Canada">Canada</option>
        <option data-provinces='[["Aguascalientes","Aguascalientes"],["Nuevo León","Nuevo León"],["Sonora","Sonora"]]' value="Mexico">Mexico</option>
      </select>
      <div id="province-container" style="display: none;">
        <select id="province" data-default="Nuevo León">
      </div>
    `;

    countrySelector = new CountryProvinceSelector('country', 'province', {
      hideElement: 'province-container',
    });

    countryEl = document.getElementById('country');
    provinceEl = document.getElementById('province');
    provinceContainer = document.getElementById('province-container');
  });

  test('sets country selector value based on its data-default attribute', () => {
    expect(countryEl.value).toBe('Mexico');
  });

  test('creates option elements inside province selector based on selected country provinces', () => {
    expect(provinceEl.children.length).toBe(3);
    expect(provinceEl.innerHTML).toMatch(/<option value="Sonora">Sonora<\/option>/);
    expect(provinceEl.innerHTML).toMatch(/<option value="Nuevo León">Nuevo León<\/option>/);
    expect(provinceEl.innerHTML).toMatch(/<option value="Aguascalientes">Aguascalientes<\/option>/);
  });

  test('makes the province container visible', () => {
    expect(provinceContainer.getAttribute('style')).toBe('');
  });

  test('sets province selector value based on its data-default attribute', () => {
    expect(provinceEl.value).toBe('Nuevo León');
  });
});
