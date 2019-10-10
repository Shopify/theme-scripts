import { objectToQueryParams } from "../../src/utilities";
import PredictiveSearch from "../../src/theme-predictive-search";

describe("objectToQueryParams", () => {
  it("with simple object", () => {
    /* eslint-disable camelcase */
    const obj = {
      foo: "foo",
      resources: {
        types: ["product", "collection"]
      }
    };

    expect(objectToQueryParams(obj)).toBe(
      "foo=foo&resources[types]=product,collection&"
    );
  });

  it("with complex object", () => {
    /* eslint-disable camelcase */
    const defaultConfig = {
      resources: {
        type: [PredictiveSearch.TYPES.PRODUCT],
        options: {
          unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS.LAST,
          fields: [
            PredictiveSearch.FIELDS.TITLE,
            PredictiveSearch.FIELDS.VENDOR,
            PredictiveSearch.FIELDS.PRODUCT_TYPE,
            PredictiveSearch.FIELDS.VARIANTS_TITLE
          ]
        }
      }
    };

    expect(objectToQueryParams(defaultConfig)).toBe(
      "resources[type]=product&" +
        "resources[options][unavailable_products]=last&" +
        "resources[options][fields]=title,vendor,product_type,variants.title&"
    );
  });
});
