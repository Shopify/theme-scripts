## Shopify Predictive Search JS API

### Configuration options 

<table>
  <tr>
    <th width="30%">Type of search</th>
    <th>Options</th>
  </tr>
  <tr>
    <td><code>resources</code></td>
    <td>
      <table>
        <tr>
          <th width="30%">Option</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
        <tr>
          <td><code>types</code> (required)</td>
          <td>Array</td>
          <td>Specifies the type of results requested. Currently supports <code>product</code> only.</td>
        </tr>
        <tr>
          <td><code>fuzzy</code> (optional)</td>
          <td>Boolean</td>
          <td>Enables typo tolerance when searching. A typo will be tolerated after the fourth character. Default: <code>true</code>.</td>
        </tr>
        <tr>
          <td><code>unavailable_products</code> (optional)</td>
          <td>String</td>
          <td>Specifies whether to display <code>unavailable_products</code> results. The three possible options are <code>show</code>, <code>hide</code>, and <code>bury</code>. Burying out of stock products pushes them below other matching results.  Default: <code>show</code>.</td>
        </tr>
        <tr>
          <td><code>limit</code> (optional)</td>
          <td>Integer</td>
          <td>Limits the number of results returned. Default: <code>10</code>. Min:  <code>1</code>. Max: <code>10</code>.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

See the [help docs for Predictive Search](https://help.shopify.com/en/themes/development/predictive-search) for more information.

---

### Getting started

```javascript
import PredictiveSearch from "@shopify/theme-predictive-search";

var predictiveSearch = new PredictiveSearch({
  resources: {
    fuzzy: true,
    types: [PredictiveSearch.TYPES.PRODUCT],
    limit: 4,
    unavailable_products: "bury"
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
          "id": 1,
          "title": "The Calling",
          "body": "<p>The Calling</p>",
          "handle": "calling",
          "image": "https://cdn.shopify.com/...",
          "type": "Bikes",
          "tags": ["bike", "dolphin"],
          "url": "/products/calling?variant_id=1",
          "price": "3099",
          "available": true,
          "variants": [
            {
              "title": "Large / Angry Dolphin",
              "url": "https://www.evil-bikes.com/products/calling",
              "image": "https://cdn.shopify.com/...",
              "price": "3099",
              "compare_at_price": "4099",
              "available": true,
            }
          ]
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
