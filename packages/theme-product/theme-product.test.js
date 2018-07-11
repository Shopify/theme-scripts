/**
 * @jest-environment jsdom
 */

import path from "path";
import { getVariant } from "./theme-product";

describe("getVariant()", () => {
  let productJson;

  beforeEach(() => {
    let productJsonLiquid = `
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

    document.body.innerHTML = productJsonLiquid;
    productJson = JSON.parse(document.getElementById("productJson").innerHTML);
  });

  test("is a function exported by theme-product.js", () => {
    expect(typeof getVariant).toBe("function");
  });

  test("returns a variant object if parameter is an id", () => {
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
    const variant = getVariant(productJson, false);

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
