export default function request(configParams, query, onSuccess, onError) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var contentType = xhr.getResponseHeader("Content-Type");

      if (xhr.status >= 500) {
        onError(new Error("Server Error"));

        return;
      }

      if (
        typeof contentType !== "string" ||
        contentType.toLowerCase().match("application/json") === null
      ) {
        onError(new Error("Request Error"));

        return;
      }

      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          res.query = query;
          onSuccess(res);
        } catch (error) {
          onError(error);
        }

        return;
      }

      if (xhr.status === 429) {
        try {
          var throttledJson = JSON.parse(xhr.responseText);
          var throttledError = new Error();

          throttledError.name = throttledJson.message;
          throttledError.message = throttledJson.description;
          throttledError.retryAfter = xhr.getResponseHeader("Retry-After");

          onError(throttledError);
        } catch (error) {
          onError(error);
        }

        return;
      }

      if (xhr.status) {
        try {
          var genericErrorJson = JSON.parse(xhr.responseText);
          var genericError = new Error();

          genericError.name = genericErrorJson.message;
          genericError.message = genericErrorJson.description;

          onError(genericError);
        } catch (error) {
          onError(error);
        }

        return;
      }

      onError(new Error("Request Error"));

      return;
    }
  };

  xhr.open(
    "get",
    "/search/suggest.json?s=" + encodeURIComponent(query) + "&" + configParams
  );

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send();
}
