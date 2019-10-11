## Shopify Predictive Search JS API

### Configuration options

<table>
  <tr>
    <th width="30%">Options</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>resources</code> (required)</td>
    <td>Object</td>
    <td>Requests <code>resources</code> results for the given query, based on the <code>type</code> and <code>limit</code> fields.</td>
  </tr>
  <tr>
    <td><code>type</code> (required)</td>
    <td>Array</td>
    <td>Specifies the type of results requested. Valid values: <code>product</code>, <code>page</code>, <code>article</code>.</td>
  </tr>
  <tr>
    <td><code>limit</code> (optional)</td>
    <td>Integer</td>
    <td>Limits the number of results returned. Default: <code>10</code>. Min:  <code>1</code>. Max: <code>10</code>.</td>
  </tr>
  <tr>
    <td><code>options</code> (optional)</td>
    <td>Object</td>
    <td>Specifies <code>options</code> for the requested resources based on the <code>unavailable_products</code> and <code>fields</code> settings.</td>
  </tr>
  <tr>
    <td><code>unavailable_products</code> (optional)</td>
    <td>String</td>
    <td>Specifies whether to display results for unavailable products. The three possible options are <code>show</code>, <code>hide</code>, and <code>last</code>. Set to <code>last</code> to display unavailable products below other matching results.  Set to <code>hide</code> to filter out unavailable products from the search results. Default: <code>last</code>.</td>
  </tr>
  <tr>
    <td><code>fields</code> (optional)</td>
    <td>Array</td>
    <td>Specifies the list of fields to search on.  Valid fields are: <code>author</code>, <code>body</code>, <code>product_type</code>, <code>tag</code>, <code>title</code>, <code>variants.barcode</code>, <code>variants.sku</code>, <code>variants.title</code>, and <code>vendor</code>.  The default fields searched on are: <code>title</code>, <code>product_type</code>, <code>variants.title</code>, and <code>vendor</code>.  For the best search experience, we recommend searching on the default field set or as few fields as possible.</td>
  </tr>
</table>

See the [help docs for Predictive Search](https://help.shopify.com/en/themes/development/predictive-search) for more information.

---

### Getting started

```javascript
import PredictiveSearch from "@shopify/theme-predictive-search";

var predictiveSearch = new PredictiveSearch({
  resources: {
    type: [PredictiveSearch.TYPES.PRODUCT],
    limit: 4,
    options: {
      unavailable_products: "last",
      fields: [
        PredictiveSearch.FIELDS.TITLE,
        PredictiveSearch.FIELDS.PRODUCT_TYPE,
        PredictiveSearch.FIELDS.VARIANTS_TITLE
      ]
    }
  }
});

predictiveSearch.on("success", function(json) {
  // See "Success Response" section of this document
});

predictiveSearch.on("error", function(error) {
  // See "HTTP status `3xx-4xx` Response" section of this document
});

predictiveSearch.query("Yeti SB165");
```

---

### Success Response

```json
// JSON Output
{
  "resources": {
    "results": {
      "products": [
        {
          "available": true,
          "body": "<p>The best bike ever made</p>",
          "compare_at_price_max": "5199.99",
          "compare_at_price_min": "4899.99",
          "handle": "yeti-sb165",
          "id": 111,
          "image": "https://cdn.shopify.com/s/...",
          "price": "4999.99",
          "price_max": "5199.99",
          "price_min": "4899.99",
          "tags": ["best", "bike", "ever", "made"],
          "title": "Yeti SB165",
          "type": "best-bike",
          "url": "/products/sb165",
          "variants": [
            {
              "available": true,
              "compare_at_price": "9999.99",
              "id": 222,
              "image": "https://cdn.shopify.com/s/...",
              "price": "9999.99",
              "title": "Yeti SB165 X01 build",
              "url": "/products/sb165/x01"
            }
          ],
          "vendor": "Yeti Cyclesr"
        }
      ]
    }
  }
}
```

### HTTP status `3xx-4xx` Response

```js
predictiveSearch.on("error", function(error) {
  console.error(error.status); // Ex. output: 429
  console.error(error.name); // Ex. output: Throttled
  console.error(error.message); // Ex. output: Too Many Requests

  // When the request response HTTP status is 429
  console.error(error.retryAfter); // Ex. output: 100
});
```
