export default function objectToQueryParams(obj, parentKey) {
  var output = "";
  parentKey = parentKey || null;

  Object.keys(obj).forEach(function(key) {
    var outputKey = key + "=";
    if (parentKey) {
      outputKey = parentKey + "[" + key + "]";
    }

    switch (trueTypeOf(obj[key])) {
      case "object":
        output += objectToQueryParams(obj[key], parentKey ? outputKey : key);
        break;
      case "array":
        output +=
          obj[key]
            .map(function(item) {
              return outputKey + "[]=" + encodeURIComponent(item);
            })
            .join("&") + "&";
        break;
      default:
        if (parentKey) {
          outputKey += "=";
        }
        output += outputKey + encodeURIComponent(obj[key]) + "&";
        break;
    }
  });

  return output;
}

function trueTypeOf(obj) {
  return Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
}
