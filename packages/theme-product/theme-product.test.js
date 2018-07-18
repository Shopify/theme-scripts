/**
 * @jest-environment jsdom
 */
import { getVariant, optionArrayFromOptionCollection } from "./theme-product";
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

  test("throws error if productJson JSON is empty", () => {
    expect(() => {
      getVariant({}, 6908023078973);
    }).toThrow();
  });

  test("returns a product variant object when called with valid arguments", () => {
    const variant = getVariant(productJson, 6908023078973);
    expect(variant).toEqual(productJson.variants[0]);
  });

  test("returns an empty object when called with arguments with no succesful matches", () => {
    const variant = getVariant(productJson, 6909083098073);
    expect(variant).toEqual({});
  });

  test("returns a product variant object when called with an object with 'id' key", () => {
    const variant = getVariant(productJson, { id: 6908198649917 });
    expect(variant).toEqual(productJson.variants[2]);
  });

  test("returns a product variant object when called with collection's options with 'name' and 'value' keys", () => {
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

    const variant = getVariant(productJson, collections);
    expect(variant).toEqual(productJson.variants[0]);
  });

  test("returns an empty object when called with a collection of options with invalid values", () => {
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
    expect(variant).toEqual({});
  });

  test("returns a product variant object when called with an array of values", () => {
    const arrayValues = ["38", "Black"];
    const variant = getVariant(productJson, arrayValues);
    expect(variant).toEqual(productJson.variants[2]);
  });

  test("returns an empty object when when called with an array of invalid values", () => {
    const arrayValues = ["45", "Black"];

    const variant = getVariant(productJson, arrayValues);
    expect(variant).toEqual({});
  });
});

describe("optionArrayFromOptionCollection", () => {
  let productJson;

  beforeEach(() => {
    let markup = getProductJsonMock();
    document.body.innerHTML = `<script id="productJson" type="application/json">${markup}</script>`;
    productJson = JSON.parse(document.getElementById("productJson").innerHTML);
  });

  test("is a function exported by theme-product.js", () => {
    expect(typeof optionArrayFromOptionCollection).toBe("function");
  });

  test("returns an array of matched options when called with an object of valid keys and values", () => {
    const criteria = [
      { name: "Size", value: "36" },
      { name: "Color", value: "Black" }
    ];
    const variant = optionArrayFromOptionCollection(productJson, criteria);
    const expected = ["36", "Black"];
    expect(variant).toEqual(expected);
  });

  test("returns an empty array when called with an object of unmatched 'name' key", () => {
    const criteria = [
      { name: "Random", value: "test" },
      { name: "House", value: "Wall" }
    ];
    const variant = optionArrayFromOptionCollection(productJson, criteria);
    expect(variant).toEqual([]);
  });

  test("throws an error message when called with an object with 'name' key is absent", () => {
    const criteria = [
      { color: "Red", image: "myimage.jpg" },
      { property: "Name", value: "Random" }
    ];

    expect(() => {
      optionArrayFromOptionCollection(productJson, criteria);
    }).toThrow();
  });
});
