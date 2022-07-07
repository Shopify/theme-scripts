function getDefaultRequestConfig() {
  return JSON.parse(
    JSON.stringify({
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
      }
    })
  );
}

function fetchJSON(url, config) {
  return fetch(url, config).then(function(response) {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function getRoute() {
  if(window.Shopify.routes.root) {
    return window.Shopify.routes.root;
  }
  return '/';
}

export function cart() {
  return fetchJSON(getRoute() + 'cart.js', getDefaultRequestConfig());
}

export function cartAdd(id, quantity, properties) {
  var config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify({
    id: id,
    quantity: quantity,
    properties: properties
  });

  return fetchJSON(getRoute() + 'cart/add.js', config);
}

export function cartAddFromForm(formData) {
  var config = getDefaultRequestConfig();
  delete config.headers['Content-Type'];

  config.method = 'POST';
  config.body = formData;

  return fetchJSON(getRoute() + 'cart/add.js', config);
}

export function cartChange(line, options) {
  var config = getDefaultRequestConfig();

  options = options || {};

  config.method = 'POST';
  config.body = JSON.stringify({
    line: line,
    quantity: options.quantity,
    properties: options.properties
  });

  return fetchJSON(getRoute() + 'cart/change.js', config);
}

export function cartClear() {
  var config = getDefaultRequestConfig();
  config.method = 'POST';

  return fetchJSON(getRoute() + 'cart/clear.js', config);
}

export function cartUpdate(body) {
  var config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify(body);

  return fetchJSON(getRoute() + 'cart/update.js', config);
}

export function cartShippingRates() {
  return fetchJSON(getRoute() + 'cart/shipping_rates.json', getDefaultRequestConfig());
}
