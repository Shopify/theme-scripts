## `@shopify/theme-predictive-search-component`

## Description

Predictive search UI state component.

## Dependency

[`@shopify/theme-predictive-search`](https://github.com/Shopify/theme-scripts/blob/master/packages/theme-predictive-search/README.md)

## Example

```js
const predictiveSearch = new PredictiveSearch({
  selectors: {
    input: '[data-predictive-search-input="header"]',
    reset: '[data-predictive-search-reset="header"]',
    result: '[data-predictive-search-result="header"]'
  },
  resultTemplateFct: data => {
    return `
      <div class="predictive-search">
        <ul class="predictive-search__list">
          ${data.products.map(
            product => `
            <li data-search-result> <!-- important to add the data-search-result attribute to each result -->
              <img src="${product.image}" alt="${product.title}" />
              <span>${product.title}</span>
            </li>
          `
          )}
        </ul>
      </div>
    `;
  },
  // (a11y) Function to return the number of results that you will display.
  // This will be announced to the user via an aria-live.
  numberOfResultsTemplateFct: data => {
    if (data.products.length === 1) {
      return "one result found";
    } else {
      return "[results_count] results found".replace(
        "[results_count]",
        data.products.length
      );
    }
  },
  // (a11y) Return a string that indicates that we're loading results.
  // This will be announced to the user via an aria-live.
  loadingResultsMessageTemplateFct: () => {
    return "loading";
  },
  onInputFocus: nodes => {
    // You can get a reference to active target
    console.log(nodes.input.id); //-> input
    console.log(nodes.submit.id); //-> submit
    console.log(nodes.result.id); //-> result
  },
  onInputKeyup: nodes => {
    return true; // This will allow the event callback to execute
  },
  onInputBlur: nodes => {
    return false; // This will prevent the event callback to execute
  },
  onInputClear: nodes => {},
  onBeforeKill: nodes => {},
  onBeforeOpen: nodes => {},
  onOpen: nodes => {},
  onBeforeClose: nodes => {},
  onClose: nodes => {},
  onDestroy: nodes => {}
});

// Public methods
predictiveSearch.open();
predictiveSearch.close();
predictiveSearch.destroy();
predictiveSearch.clearAndClose();
```

---
