/**
 * @jest-environment jsdom
 */
import { getVariant } from "./theme-product";
import { getProductJsonMock } from "./__mocks__/product";

describe("getVariant()", () => {
  let productJson;

  beforeEach(() => {
    let markup = getProductJsonMock();
    document.body.innerHTML = `<script id="productJson" type="application/json">${markup}</script>`;
    productJson = JSON.parse(document.getElementById("productJson").innerHTML);
  });

  test("is a function exported by theme-product.js", () => {
    expect(typeof getVariant).toBe("function");
  });

  test("throws error if productJson is invalid", () => {
    const variant = getVariant(undefined, false);

    // expect(variant).toBeFalsy();
  });

  // rephrase
  test("returns a variant object if parameter is an id", () => {
    const variant = getVariant(productJson, 6908023078973);
    // mock object
    const expected = {
      id: 6908023078973,
      product_id: 520670707773,
      title: "36 / Black",
      option1: "36",
      option2: "Black",
      options: ["36", "Black"]
    };

    expect(variant).toEqual(expected);
  });

  // rephrase +
  test("returns false if parameter is false", () => {
    const variant = getVariant(productJson, false);

    expect(variant).toBeFalsy();
  });

  test("returns false if parameter is undefined", () => {
    const variant = getVariant(productJson, undefined);

    expect(variant).toBeFalsy();
  });

  test("returns a variant if parameter is an object with id key", () => {
    const variant = getVariant(productJson, { id: 6908198649917 });
    const expected = {
      id: 6908198649917,
      product_id: 520790016061,
      title: "38 / Black",
      option1: "38",
      option2: "Black",
      options: ["38", "Black"]
    };

    expect(variant).toEqual(expected);
  });

  test("returns true if value is a collection of options with name and value keys", () => {
    const collections = [
      {
        name: "Size",
        value: "36"
      },
      {
        name: "Color",
        value: "Black"
      }
    ];

    const expected = {
      id: 6908023078973,
      product_id: 520670707773,
      title: "36 / Black",
      option1: "36",
      option2: "Black",
      options: ["36", "Black"]
    };

    const variant = getVariant(productJson, collections);
    expect(variant).toEqual(expected);
  });

  test("returns false if value is a collection of options with name and invalid value keys", () => {
    const collections = [
      {
        name: "Size",
        value: "10"
      },
      {
        name: "Color",
        value: "Purple"
      }
    ];

    const variant = getVariant(productJson, collections);
    expect(variant).toBeFalsy();
  });

  test("returns true if value is an array of values", () => {
    const arrayValues = ["38", "Black"];

    const expected = {
      id: 6908198649917,
      product_id: 520790016061,
      title: "38 / Black",
      option1: "38",
      option2: "Black",
      options: ["38", "Black"]
    };

    const variant = getVariant(productJson, arrayValues);
    expect(variant).toEqual(expected);
  });

  test("returns false if value is an array of invalid values", () => {
    const arrayValues = ["45", "Black"];

    const variant = getVariant(productJson, arrayValues);
    expect(variant).toBeFalsy();
  });
});

describe("optionArrayFromOptionCollection", () => {
  test("returns object when object is valid", () => {});

  test("throws error message when 'name' key is not a String", () => {});

  test("throws error message when 'name' key is absent", () => {});

  test("throws error message when 'name' key does not match any values", () => {});
});
