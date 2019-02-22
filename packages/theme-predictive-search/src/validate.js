export function validateQuery(query) {
  var error;

  if (query === null || query === undefined) {
    error = new TypeError("'query' is missing");
    error.type = "argument";
    throw error;
  }

  if (typeof query !== "string") {
    error = new TypeError("'query' is not a string");
    error.type = "argument";
    throw error;
  }
}
