## Shopify AJAX Search API

### Getting started

```javascript
import PredictiveSearch from "@shopify/theme-predictive-search";

var predictiveSearch = new PredictiveSearch({
  search_as_you_type: {
    fuzzy: true,
    types: [PredictiveSearch.TYPES.PRODUCT]
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
          "price": "3099.00",
          "variants": [
            {
              "title": "Large / Angry Dolphin",
              "url": "https://www.evil-bikes.com/products/calling",
              "image": "https://cdn.shopify.com/...",
              "price": "3099.00",
              "compare_at_price": "4099.00"
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
