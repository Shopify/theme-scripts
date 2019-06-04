import xhrMock from "xhr-mock";
import PredictiveSearch from "../src/theme-predictive-search";
import searchAsYouTypeTheCallingFixture from "../__fixtures__/search_as_you_type_the_calling.json";

/* eslint-disable camelcase */
const defaultConfig = {
  resources: {
    fuzzy: true,
    types: [PredictiveSearch.TYPES.PRODUCT]
  }
};

describe("Search()", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    xhrMock.setup();
  });

  afterEach(() => {
    xhrMock.teardown();
  });

  it("should be able to create an instance", () => {
    const search = new PredictiveSearch(defaultConfig);
    expect(search).toBeInstanceOf(PredictiveSearch);
  });

  describe("throws", () => {
    it("when config object is not set", () => {
      let search;
      expect(() => {
        search = new PredictiveSearch();
      }).toThrow(new TypeError("No config object was specified"));
      expect(search).toBeUndefined();
    });
  });

  describe("query()", () => {
    describe("throws", () => {
      it("when the query is not present", done => {
        const search = new PredictiveSearch(defaultConfig);

        search.on("error", error => {
          expect(error.type).toBe("argument");
          expect(error.message).toBe("'query' is missing");
          done();
        });

        search.query();
      });

      it("when the query is not a string", done => {
        const search = new PredictiveSearch(defaultConfig);

        search.on("error", error => {
          expect(error.type).toBe("argument");
          expect(error.message).toBe("'query' is not a string");
          done();
        });

        search.query(1);
      });
    });

    describe("debounce", () => {
      it("does not make a request before the debounce rate", () => {
        let xhrCalls = 0;
        const spy = jest.fn();
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(200)
            .header("Content-Type", "application/json")
            .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
        });

        search.on("success", spy);

        search.query("The Calling");

        expect(xhrCalls).toBe(0);

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);
        expect(spy).toBeCalledTimes(1);
      });

      it("only make one request on multiple calls to query()", () => {
        let xhrCalls = 0;
        const spy = jest.fn();
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(200)
            .header("Content-Type", "application/json")
            .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
        });

        search.on("success", spy);

        search.query("The Calling");
        search.query("The Calling");
        search.query("The Calling");

        expect(xhrCalls).toBe(0);

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);
        expect(spy).toHaveBeenNthCalledWith(1, {
          query: "The Calling",
          ...searchAsYouTypeTheCallingFixture
        });
      });
    });

    describe("200", () => {
      it("does not make a request when query is empty", () => {
        let xhrCalls = 0;
        const spy = jest.fn();
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(200)
            .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
        });

        search.on("success", spy);

        search.query("");

        expect(xhrCalls).toBe(0);

        jest.runAllTimers();

        expect(xhrCalls).toBe(0);
        expect(spy).not.toBeCalledTimes(1);
      });

      it("result has the expected shape", () => {
        let xhrCalls = 0;
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(200)
            .header("Content-Type", "application/json")
            .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
        });

        search.on("success", result => {
          expect(result).toMatchObject({
            resources: {
              results: {
                products: [
                  {
                    title: "The Calling",
                    body: "<p>The Calling</p>",
                    handle: "calling",
                    image: "https://cdn.shopify.com/...",
                    url: "/products/calling?variant_id=1",
                    price: "3099",
                    variants: [
                      {
                        title: "Large / Angry Dolphin",
                        url: "https://www.evil-bikes.com/products/calling",
                        image: "https://cdn.shopify.com/...",
                        price: "3099",
                        compare_at_price: "4099"
                      }
                    ]
                  }
                ]
              }
            }
          });
        });

        search.query("The Calling");

        expect(xhrCalls).toBe(0);

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);
      });

      it("gets a previous request response from local cache", () => {
        let xhrCalls = 0;
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(200)
            .header("Content-Type", "application/json")
            .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
        });

        search.query("The Calling");

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);

        search.query("The Following");

        jest.runAllTimers();

        expect(xhrCalls).toBe(2);

        search.query("The Calling");

        jest.runAllTimers();

        expect(xhrCalls).toBe(2);
      });
    });

    describe("200 gets the latest result", () => {
      it("when first request resolves after the last request", () => {
        let xhrCalls = 0;
        const spy = jest.fn();
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(
          /^\/search\/suggest\.json\?s=The%20Calling/g,
          (req, res) => {
            xhrCalls++;
            return res
              .status(200)
              .header("Content-Type", "application/json")
              .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
          }
        );

        xhrMock.get(/^\/search\/suggest\.json\?s=The%20Following/g, () => {
          return new Promise(() => null);
        });

        search.on("success", spy);

        search.query("The Calling");

        jest.runAllTimers();

        search.query("The Following");

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({
          query: "The Calling",
          ...searchAsYouTypeTheCallingFixture
        });
      });
    });

    describe("429 Too Many Requests", () => {
      it("gets the rate limit header and set it to the error object and the predictiveSearch instance", () => {
        let xhrCalls = 0;
        const search = new PredictiveSearch(defaultConfig);

        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
          xhrCalls++;
          return res
            .status(429)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json")
            .body(
              JSON.stringify({
                status: 429,
                message: "Throttled",
                description: "Too Many Requests"
              })
            );
        });

        search.on("error", error => {
          expect(error.name).toBe("Throttled");
          expect(error.message).toBe("Too Many Requests");
          expect(error.retryAfter).toBe(1000);
          expect(search._retryAfter).toBe(1000);
        });

        search.query("The Calling");

        jest.runAllTimers();

        expect(xhrCalls).toBe(1);
      });
    });
  });
});
