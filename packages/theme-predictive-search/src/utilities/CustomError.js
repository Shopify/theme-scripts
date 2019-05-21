export function GenericError() {
  var error = Error.call(this);

  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;

  return error;
}

export function NotFoundError(status) {
  var error = Error.call(this);

  error.name = "Not found";
  error.message = "Not found";
  error.status = status;

  return error;
}

export function ServerError() {
  var error = Error.call(this);

  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;

  return error;
}

export function ContentTypeError(status) {
  var error = Error.call(this);

  error.name = "Content-Type error";
  error.message = "Content-Type was not provided or is of wrong type";
  error.status = status;

  return error;
}

export function JsonParseError(status) {
  var error = Error.call(this);

  error.name = "JSON parse error";
  error.message = "JSON syntax error";
  error.status = status;

  return error;
}

export function ThrottledError(status, name, message, retryAfter) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;
  error.retryAfter = retryAfter;

  return error;
}

export function InvalidParameterError(status, name, message) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;

  return error;
}

export function ExpectationFailedError(status, name, message) {
  var error = Error.call(this);

  error.name = name;
  error.message = message;
  error.status = status;

  return error;
}
