/**
 * @jest-environment jsdom
 */

import path from "path";
import { getVariant } from "./theme-product";

describe("getVariant()", () => {
  beforeEach(() => {
    let productJson = `
        <script id="productJson" type="application/json">
        {
            "id": 520670707773,
            "title": "Aircontact 75 + 10",
            "vendor": "tauclothes",
            "variants": [
                {
                    "id": 6908023078973,
                    "product_id": 520670707773,
                    "title": "36 / Black",
                    "option1": "36",
                    "option2": "Black",
                    "options": ["36", "Black"]
                },
                {
                    "id": 6908198682685,
                    "product_id": 520790016061,
                    "title": "37 / Black",
                    "option1": "37",
                    "option2": "Black",
                    "options": ["37", "Black"]
                },
                {
                    "id": 6908198649917,
                    "product_id": 520790016061,
                    "title": "38 / Black",
                    "option1": "38",
                    "option2": "Black",
                    "options": ["38", "Black"]
                }
            ],
            "options": [
                {
                  "id": 967657816125,
                  "product_id": 675815555133,
                  "name": "Size",
                  "position": 1,
                  "values": [
                    "36",
                    "37",
                    "38"
                  ]
                },
                {
                  "id": 967657848893,
                  "product_id": 675815555133,
                  "name": "Color",
                  "position": 2,
                  "values": [
                    "Black"
                  ]
                }
            ],
            "images": [
                {
                    "id": 2004809744445,
                    "product_id": 520670707773,
                    "variant_ids": []
                }
            ],
            "image": {
                "id": 2004809744445,
                "product_id": 520670707773,
                "variant_ids": []
            }
        }
        </script>
    `;

    document.body.innerHTML = productJson;
  });

  test("is a function exported by theme-product.js", () => {
    expect(typeof getVariant).toBe("function");
  });

  test("returns a variant object if parameter is an id", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const variant = getVariant(productJson, 6908023078973);
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

  test("returns false if parameter is invalid", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const variant = getVariant(productJson, false);

    expect(variant).toBeFalsy();
  });

  test("returns a variant if parameter is an object with id key", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

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
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

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

  xtest("returns false if value is a collection of options with name and non-existing value keys", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const collections = [
      {
        name: "FakeVariant"
      },
      {
        name: "DoesNotExist"
      }
    ];

    const variant = getVariant(productJson, collections);
  });

  xtest("returns true if value is an array of values", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const collections = ["Black", "Blue Jewel/Silver"];

    const variant = getVariant(productJson, collections);
  });

  xtest("returns false if value is an array of non-existing values", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const collections = ["DoesNotExist", "FakeVariant"];

    const variant = getVariant(productJson, collections);
    expect(variant).toBeFalsy();
  });
});
