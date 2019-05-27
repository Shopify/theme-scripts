export function mergeObjects() {
  var to = Object({});

  for (var index = 0; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource) {
      for (var nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}
