# @shopify/theme-product

## Getting Started

Theme Scripts can be used in any theme project. To take advantage of semantic versioning and easy updates, we recommend using NPM or Yarn to include them in your project:

```
yarn add @shopify/theme-product
```

and then import the functions you wish to use through ES6 imports:

```
import * as product from '@shopify/theme-product`;
```

If you prefer not to use a package manager, you can download the latest version of Theme Product and include it in your project manually from the following links:

- [theme-product.js](http://unpkg.com/@shopify/theme-product@latest/dist/theme-product.js)
- [theme-product.min.js](http://unpkg.com/@shopify/theme-product@latest/dist/theme-product.min.js)

These files make Theme Product accessible via the `Shopify.theme.product` global variable.

## Usage

Theme product is a helper script related to Product informations. For instance, you can find the variant of a product by providing some criterias.

### getVariant(product, value)

- `product`: Product JSON object. Usually it is the [`Product`](https://help.shopify.com/en/themes/liquid/objects/product) object generated from Liquid.
  Note: The JSON generated from Liquid is different from the conventional [`{{ json }}`](https://help.shopify.com/en/themes/liquid/filters/additional-filters#json) filter due to some properties not being exposed.

```json
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
            ...
        },
        {
            "id": 6908198682685,
            "product_id": 520790016061,
            "title": "37 / Black",
            "option1": "37",
            "option2": "Black",
            "options": ["37", "Black"]
            ...
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
                "37"
            ]
            ...
        },
        {
            "id": 967657848893,
            "product_id": 675815555133,
            "name": "Color",
            "position": 2,
            "values": [
                "Black"
            ]
            ...
        }
    ],
    "images": [
        {
            "id": 2004809744445,
            "product_id": 520670707773,
            "variant_ids": []
            ...
        }
    ],
    "image": {
        "id": 2004809744445,
        "product_id": 520670707773,
        "variant_ids": []
        ...
    }
}
```

- `value`: The targeted value. It accepts :

```javascript
    - Strings/Number (e.g. 520670707773)
    - Object with ID key (e.g. { id: 6908198649917 })
    - Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
    - Array of values: (e.g. ["38", "Black"])
```

---
