import xhrMock from "xhr-mock";
import request from "../src/request";

describe("request()", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    xhrMock.setup();
  });

  afterEach(() => {
    xhrMock.teardown();
  });

  describe("200", () => {
    it("valid", () => {
      const spyOnSucess = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .body(JSON.stringify({ foo: "bar" }))
      );

      request("config=foo", "foo-200", spyOnSucess);

      jest.runAllTimers();

      expect(spyOnSucess).toHaveBeenNthCalledWith(1, {
        query: "foo-200",
        foo: "bar"
      });
    });

    it("valid with Content-Type with uppercase characters", () => {
      const spyOnSucess = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "APPLICATION/JSON; CHARSET=utf-8")
          .body(JSON.stringify({ foo: "bar" }))
      );

      request("config=foo", "foo-200", spyOnSucess);

      jest.runAllTimers();

      expect(spyOnSucess).toHaveBeenNthCalledWith(1, {
        query: "foo-200",
        foo: "bar"
      });
    });

    it("fails on invalid JSON", () => {
      const spyOnError = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "text/html")
          .body("boom")
      );

      request("config=foo", "foo-200-invalid", null, spyOnError);

      jest.runAllTimers();

      expect(spyOnError).toHaveBeenCalledWith(
        new Error("An error ocurred whilst sending the request.")
      );
    });

    it("fails with an invalid Content-Type header", () => {
      const spyOnError = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "boom")
          .body("boom")
      );

      request("config=foo", "foo-200-invalid", null, spyOnError);

      jest.runAllTimers();

      expect(spyOnError).toHaveBeenCalledWith(
        new Error("An error ocurred whilst sending the request.")
      );
    });

    it("fails in the absence of Content-Type header", () => {
      const spyOnError = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res.status(200).body("boom")
      );

      request("config=foo", "foo-200-invalid", null, spyOnError);

      jest.runAllTimers();

      expect(spyOnError).toHaveBeenCalledWith(
        new Error("An error ocurred whilst sending the request.")
      );
    });
  });

  describe("4xx", () => {
    it("404", () => {
      const spyOnError = jest.fn();
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(404)
          .header("Content-Type", "text/html")
          .body("boom")
      );

      request("config=foo", "foo-404", null, spyOnError);

      jest.runAllTimers();

      expect(spyOnError).toHaveBeenCalledWith(
        new Error("An error ocurred whilst sending the request.")
      );
    });

    describe("422", () => {
      it("valid", () => {
        const spyOnError = jest.fn();
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(422)
            .header("Content-Type", "application/json; charset=utf-8")
            .body(
              JSON.stringify({
                status: 429,
                message: "Invalid parameter error",
                description: "Invalid parameter error description"
              })
            )
        );

        request("config=foo", "foo-422", null, spyOnError);

        jest.runAllTimers();

        const expectedError = new Error();
        expectedError.name = "Invalid parameter error";
        expectedError.message = "Invalid parameter error description";

        expect(spyOnError).toHaveBeenNthCalledWith(1, expectedError);
      });

      it("invalid JSON", () => {
        const spyOnError = jest.fn();
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(429)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json; charset=utf-8")
            .body("Invalid parameter error")
        );

        request("config=foo", "foo-422-invalid", null, spyOnError);

        jest.runAllTimers();

        expect(spyOnError).toHaveBeenCalledTimes(1);
      });
    });

    describe("429", () => {
      it("valid", () => {
        const spyOnError = jest.fn();
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(429)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json; charset=utf-8")
            .body(
              JSON.stringify({
                status: 429,
                message: "Throttled",
                description: "Too Many Requests"
              })
            )
        );

        request("config=foo", "foo-429", null, spyOnError);

        jest.runAllTimers();

        const expectedError = new Error();
        expectedError.name = "Throttled";
        expectedError.message = "Too Many Requests";
        expectedError.retryAfter = 1000;

        expect(spyOnError).toHaveBeenNthCalledWith(1, expectedError);
      });

      it("invalid JSON", () => {
        const spyOnError = jest.fn();
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(429)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json; charset=utf-8")
            .body("Throttled")
        );

        request("config=foo", "foo-429-invalid", null, spyOnError);

        jest.runAllTimers();

        expect(spyOnError).toHaveBeenCalledTimes(1);
      });
    });
  });
});
