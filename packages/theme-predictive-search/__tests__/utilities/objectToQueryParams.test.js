import { objectToQueryParams } from "../../src/utilities";

describe("objectToQueryParams", () => {
  it("with simple object", () => {
    /* eslint-disable camelcase */
    const obj = {
      foo: "foo",
      resources: {
        fuzzy: true,
        types: ["product", "collection"]
      }
    };

    expect(objectToQueryParams(obj)).toBe(
      "foo=foo&" +
        "resources[fuzzy]=true&" +
        "resources[types][]=product&" +
        "resources[types][]=collection&"
    );
  });

  it("with complex object", () => {
    /* eslint-disable camelcase */
    const obj = {
      root_level_key: "root_level_value",
      root: {
        root_key: "root_value",
        root_arr: ["a", "b"],
        obj1: {
          obj1_key: "obj1_value",
          arr1: ["c", "d"],
          obj2: {
            obj2_key1: "obj2_value",
            obj2_key2: "$&+,;=?@ ''<>#%{}|^~[]`",
            arr2: ["e", "f", "$&+,;=?@ ''<>#%{}|^~[]`\""]
          }
        }
      }
    };

    expect(objectToQueryParams(obj)).toBe(
      "root_level_key=root_level_value&" +
        "root[root_key]=root_value&" +
        "root[root_arr][]=a&" +
        "root[root_arr][]=b&" +
        "root[obj1][obj1_key]=obj1_value&" +
        "root[obj1][arr1][]=c&" +
        "root[obj1][arr1][]=d&" +
        "root[obj1][obj2][obj2_key1]=obj2_value&" +
        "root[obj1][obj2][obj2_key2]=%24%26%2B%2C%3B%3D%3F%40%20''%3C%3E%23%25%7B%7D%7C%5E~%5B%5D%60&" +
        "root[obj1][obj2][arr2][]=e&" +
        "root[obj1][obj2][arr2][]=f&" +
        "root[obj1][obj2][arr2][]=%24%26%2B%2C%3B%3D%3F%40%20''%3C%3E%23%25%7B%7D%7C%5E~%5B%5D%60%22&"
    );
  });
});
