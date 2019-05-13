## Shopify Predictive Search JS API

### Configuration options 

<table>
  <tr>
    <th width="30%">Type of search</th>
    <th>Options</th>
  </tr>
  <tr>
    <td><code>search_as_you_type</code></td>
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
          <td><code>out_of_stock</code> (optional)</td>
          <td>String</td>
          <td>Specifies whether to display <code>out_of_stock</code> results. The three possible options are <code>show</code>, <code>hide</code>, and <code>bury</code>. Burying out of stock products pushes them below other matching results.  Default: <code>show</code>.</td>
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
  search_as_you_type: {
    fuzzy: true,
    types: [PredictiveSearch.TYPES.PRODUCT],
    limit: 4,
    out_of_stock: "bury"
  }
});

predictiveSearch.on("success", function(json) {
  // See "Response Shape" section of this document
});

predictiveSearch.on("error", function(error) {
  // See "Error Response Shape" section of this document
});

predictiveSearch.query("The Calling");
```

---

### Response Shape

```json
// JSON Output
{
  "search_as_you_type": {
    "results": {
      "products": [
        {
          "title": "The Calling",
          "body": "<p>The Calling</p>",
          "handle": "calling",
          "image": "https://cdn.shopify.com/...",
          "url": "/products/calling?variant_id=1",
          "price": "3099",
          "variants": [
            {
              "title": "Large / Angry Dolphin",
              "url": "https://www.evil-bikes.com/products/calling",
              "image": "https://cdn.shopify.com/...",
              "price": "3099",
              "compare_at_price": "4099"
            }
          ]
        }
      ]
    }
  }
}
```

### Error Response Shape

```json
// JSON Output
{
  "type": "throttled",
  "message": "You have been throttled. You can send the next query in 900 milliseconds",
  "retryAfter": 900
}
```
