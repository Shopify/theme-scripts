## Shopify Predictive Search JS API

### Configuration options

<table>
  <tr>
    <th width="30%">Options</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>q</code> (required)</td>
    <td>String</td>
    <td>The search query.</td>
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

predictiveSearch.query("The Calling");
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

          "available": BOOLEAN,
          "body": STRING w/HTML,
          "compare_at_price_max": DECIMAL ("0.00" when the product has no variants with a "compare_at_price"),
          "compare_at_price_min": DECIMAL ("0.00" when the product has no variants with a "compare_at_price"),
          "handle": STRING,
          "id": INTEGER,
          "image": STRING e.g, "https://cdn.shopify.com/s/...",
          "price": DECIMAL,
          "price_max": DECIMAL,
          "price_min": DECIMAL,
          "tags" : ARRAY OF STRING,
          "title": STRING,
          "type" : STRING,
          "url": STRING e.g, "/products/fast-snowboard?_pos=1&_psq=snowb&_ss=e&_v=1.0",
          "variants": [
            {
              "available": BOOLEAN,
              "compare_at_price": DECIMAL (nullable),
              "id": INTEGER,
              "image": STRING e.g, "https://cdn.shopify.com/s/...",
              "price": DECIMAL,
              "title": STRING,
              "url": STRING e.g, "/products/fast-snowboard?_pos=1&_psq=snowb&_ss=e&_v=1.0"
            }
          ],
          "vendor": STRING
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
