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

export function cart() {
  return fetchJSON('/cart.js', getDefaultRequestConfig());
}

export function cartAdd(id, quantity, properties) {
  var config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify({
    id: id,
    quantity: quantity,
    properties: properties
  });

  return fetchJSON('/cart/add.js', config);
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

  return fetchJSON('/cart/change.js', config);
}

export function cartClear() {
  var config = getDefaultRequestConfig();
  config.method = 'POST';

  return fetchJSON('/cart/clear.js', config);
}

export function cartUpdate(body) {
  var config = getDefaultRequestConfig();

  config.method = 'POST';
  config.body = JSON.stringify(body);

  return fetchJSON('/cart/update.js', config);
}

export function cartShippingRates() {
  return fetchJSON('/cart/shipping_rates.json', getDefaultRequestConfig());
}
