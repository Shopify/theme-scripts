import { Dispatcher } from "../../src/utilities";

describe("Dispatcher", () => {
  describe("on()", () => {
    it("once", () => {
      const spy = jest.fn();
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", spy);

      dispatcher.dispatch("foo");

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("multiple", () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", spy1);
      dispatcher.on("foo", spy2);
      dispatcher.on("foo", spy3);

      dispatcher.dispatch("foo");

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);
    });
  });

  describe("off()", () => {
    it("once", () => {
      const spy = jest.fn();
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", spy);

      dispatcher.off("foo", spy);

      dispatcher.dispatch("foo");

      expect(spy).not.toHaveBeenCalledTimes(1);
    });

    it("multiple", () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", spy1);
      dispatcher.on("foo", spy2);
      dispatcher.on("foo", spy3);

      dispatcher.off("foo", spy1);
      dispatcher.off("foo", spy2);
      dispatcher.off("foo", spy3);

      dispatcher.dispatch("foo");

      expect(spy1).not.toHaveBeenCalledTimes(1);
      expect(spy2).not.toHaveBeenCalledTimes(1);
      expect(spy3).not.toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatch()", () => {
    it("once", () => {
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", jest.fn());

      dispatcher.events.foo.fire = jest.fn();

      dispatcher.dispatch("foo");

      expect(dispatcher.events.foo.fire).toHaveBeenCalledTimes(1);
    });

    it("multiple", () => {
      const dispatcher = new Dispatcher();

      dispatcher.on("foo", jest.fn());

      dispatcher.events.foo.fire = jest.fn();

      dispatcher.dispatch("foo");
      dispatcher.dispatch("foo");
      dispatcher.dispatch("foo");

      expect(dispatcher.events.foo.fire).toHaveBeenCalledTimes(3);
    });
  });
});
