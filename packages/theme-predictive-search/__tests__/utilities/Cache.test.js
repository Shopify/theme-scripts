import { Cache } from "../../src/utilities";

describe("Cache", () => {
  describe("set", () => {
    it("key/value in store", () => {
      const cache = new Cache();
      cache.set("fooKey", "fooValue");

      expect(cache._store.fooKey).toBe("fooValue");
    });

    it("key/value in store and delete oldest entry when max items is reached", () => {
      const cache = new Cache({ bucketSize: 2 });
      cache.set("fooKey", "fooValue");
      cache.set("barKey", "barValue");
      cache.set("bazKey", "bazValue");
      cache.set("totoKey", "totoValue");

      expect(Object.keys(cache._store).length).toBe(2);
      expect(cache._keys.length).toBe(2);
      expect(cache.get("fooKey")).toBeUndefined();
    });
  });

  describe("get", () => {
    it("key/value in store", () => {
      const cache = new Cache();
      cache.set("fooKey", "fooValue");

      expect(cache.get("fooKey")).toBe("fooValue");
    });
  });

  describe("has", () => {
    it("key/value in store", () => {
      const cache = new Cache();
      cache.set("fooKey", "fooValue");

      expect(cache.has("fooKey")).toBeTruthy();
    });
  });

  describe("count", () => {
    it("key/value in store", () => {
      const cache = new Cache();
      cache.set("fooKey", "fooValue");
      cache.set("barKey", "barValue");
      cache.set("bazKey", "bazValue");
      cache.set("totoKey", "totoValue");

      expect(cache.count()).toBe(4);
    });
  });

  describe("delete", () => {
    it("key/value in store", () => {
      const cache = new Cache();
      cache.set("fooKey", "fooValue");
      cache.set("barKey", "barValue");
      cache.set("bazKey", "bazValue");
      cache.set("totoKey", "totoValue");

      expect(cache.delete("bazKey")).toBeTruthy();
      expect(cache.get("bazKey")).toBeUndefined();
      expect(cache.count()).toBe(3);
    });
  });
});
