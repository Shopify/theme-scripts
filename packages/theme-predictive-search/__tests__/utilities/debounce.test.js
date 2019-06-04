import { debounce } from "../../src/utilities";

describe("debounce()", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("function", () => {
    const spyFn = jest.fn();
    const debouncedFn = debounce(spyFn, 500);

    debouncedFn();

    expect(spyFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(spyFn).toHaveBeenCalled();
  });

  it("function with arguments", () => {
    const spyFn = jest.fn();
    const debouncedFn = debounce(spyFn, 500);

    debouncedFn("arg1", "arg2");

    expect(spyFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(spyFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("function and falls back to default timer when not specified", () => {
    const spyFn = jest.fn();
    const debouncedFn = debounce(spyFn);

    debouncedFn();

    expect(spyFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(spyFn).toHaveBeenCalled();
  });
});
