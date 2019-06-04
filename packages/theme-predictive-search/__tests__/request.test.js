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

    it("fails on invalid JSON", done => {
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "text/html")
          .body("boom")
      );

      request("config=foo", "foo-200-invalid", null, error => {
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(200);
        expect(error.message).toBe(
          "Content-Type was not provided or is of wrong type"
        );
        done();
      });

      jest.runAllTimers();
    });

    it("fails with an invalid Content-Type header", done => {
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(200)
          .header("Content-Type", "boom")
          .body("boom")
      );

      request("config=foo", "foo-200-invalid", null, error => {
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(200);
        expect(error.message).toBe(
          "Content-Type was not provided or is of wrong type"
        );
        done();
      });

      jest.runAllTimers();
    });

    it("fails in the absence of Content-Type header", done => {
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res.status(200).body("boom")
      );

      request("config=foo", "foo-200-invalid", null, error => {
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(200);
        expect(error.name).toBe("Content-Type error");
        expect(error.message).toBe(
          "Content-Type was not provided or is of wrong type"
        );
        done();
      });

      jest.runAllTimers();
    });
  });

  describe("4xx", () => {
    it("404", done => {
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
        res
          .status(404)
          .header("Content-Type", "text/html")
          .body("boom")
      );

      request("config=foo", "foo-404", null, error => {
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(404);
        expect(error.name).toBe("Not found");
        expect(error.message).toBe("Not found");
        done();
      });

      jest.runAllTimers();
    });

    describe("422", () => {
      it("valid", done => {
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(422)
            .header("Content-Type", "application/json; charset=utf-8")
            .body(
              JSON.stringify({
                status: 422,
                message: "Invalid parameter error",
                description: "Invalid parameter error description"
              })
            )
        );

        request("config=foo", "foo-422", null, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.status).toBe(422);
          expect(error.name).toBe("Invalid parameter error");
          expect(error.message).toBe("Invalid parameter error description");
          done();
        });

        jest.runAllTimers();
      });

      it("invalid JSON", done => {
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(422)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json; charset=utf-8")
            .body("Invalid parameter error")
        );

        request("config=foo", "foo-422-invalid", null, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.status).toBe(422);
          expect(error.name).toBe("JSON parse error");
          done();
        });

        jest.runAllTimers();
      });
    });

    describe("429", () => {
      it("valid", done => {
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(429)
            .header("Retry-After", 1)
            .header("Content-Type", "application/json; charset=utf-8")
            .body(
              JSON.stringify({
                status: 429,
                message: "Throttled",
                description: "Too Many Requests"
              })
            )
        );

        request("config=foo", "foo-429", null, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.status).toBe(429);
          expect(error.name).toBe("Throttled");
          expect(error.message).toBe("Too Many Requests");
          expect(error.retryAfter).toBe(1);
          done();
        });

        jest.runAllTimers();
      });

      it("invalid JSON", done => {
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(429)
            .header("Retry-After", 1000)
            .header("Content-Type", "application/json; charset=utf-8")
            .body("Throttled")
        );

        request("config=foo", "foo-429-invalid", null, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.status).toBe(429);
          expect(error.name).toBe("JSON parse error");
          done();
        });

        jest.runAllTimers();
      });
    });

    describe("417", () => {
      it("head request", done => {
        xhrMock.get(/^\/search\/suggest\.json/g, (req, res) =>
          res
            .status(417)
            .header("Content-Type", "application/json; charset=utf-8")
            .body(
              JSON.stringify({
                status: 417,
                message: "Expectation Failed",
                description: "Unsupported shop primary locale"
              })
            )
        );

        request("config=foo", "foo-417", null, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.status).toBe(417);
          expect(error.name).toBe("Expectation Failed");
          expect(error.message).toBe("Unsupported shop primary locale");
          done();
        });

        jest.runAllTimers();
      });
    });
  });

  describe("500", () => {
    it("head request", done => {
      xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => res.status(500));

      request("config=foo", "foo-500", null, error => {
        expect(error).toBeInstanceOf(Error);
        expect(error.status).toBe(500);
        expect(error.name).toBe("Server error");
        expect(error.message).toBe("Something went wrong on the server");
        done();
      });

      jest.runAllTimers();
    });
  });
});
