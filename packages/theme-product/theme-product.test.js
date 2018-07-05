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
                    "title": "Default Title"
                },
                {
                    "id": 6908198682685,
                    "product_id": 520790016061,
                    "title": "Black"
                },
                {
                    "id": 6908198649917,
                    "product_id": 520790016061,
                    "title": "Blue Jewel/Silver"
                }
            ],
            "options": [
                {
                    "id": 782404026429,
                    "product_id": 520670707773,
                    "name": "Title",
                    "position": 1,
                    "values": [
                        "Default Title",
                        "Black",
                        "Blue Jewel/Silver"
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

    const variant = getVariant("testst", 6908023078973);
    const expected = {
      id: 6908023078973,
      product_id: 520670707773,
      title: "Default Title"
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

  xtest("returns a variant if parameter is an object with id key", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const variant = getVariant(productJson, { id: "Default Title" });

    expect(variant).toBeFalsy();
  });

  xtest("returns true if value is a collection of options with name and value keys", () => {
    const productJson = JSON.parse(
      document.getElementById("productJson").innerHTML
    );

    const collections = [
      {
        name: "Black"
      },
      {
        name: "Blue Jewel/Silver"
      }
    ];

    const variant = getVariant(productJson, collections);
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
