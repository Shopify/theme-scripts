/**
 * @jest-environment jsdom
 */
/* eslint-disable no-unused-vars */

/**
 * TODO
 * - Add test for destroy()
 * - Add test for body event to close predictive search
 */

import xhrMock from "xhr-mock";
import PredictiveSearchComponent from "../src/theme-predictive-search-component";
import searchAsYouTypeTheCallingFixture from "../__fixtures__/search_as_you_type_the_calling.json";

function defaultResultTemplateFct(data) {
  return `
    <ul>
      ${data.products.map(
        product => `
          <li data-search-result="">
            <a href="${product.url}">
              <img src="${product.image}" />
              <span>${product.title}</span>
              <span>${product.price}</span>
            </a>
          </li>
        `
      )}
    </ul>
  `;
}

function createPredictiveSearchComponent(config) {
  const predictiveSearchComponent = new PredictiveSearchComponent({
    selectors: {
      input: '[data-predictive-search-input="default"]',
      result: '[data-predictive-search-mount="default"]',
      reset: '[data-predictive-search-reset="default"]'
    },
    resultTemplateFct: defaultResultTemplateFct,
    numberOfResultsTemplateFct: () => null,
    loadingResultsMessageTemplateFct: () => null,
    ...config
  });

  return predictiveSearchComponent;
}

beforeEach(() => {
  jest.useFakeTimers();

  xhrMock.setup();
  xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
    return res
      .status(200)
      .header("Content-Type", "application/json")
      .body(JSON.stringify(searchAsYouTypeTheCallingFixture));
  });

  document.body.innerHTML = `
    <form action="/search" method="get">
      <input data-predictive-search-input="default" type="text" />
      <button type="reset" data-predictive-search-reset="default">Reset</button>
      <button type="submit">Submit</button>
      <div data-predictive-search-mount="default" />
    </form>
  `;
});

afterEach(() => {
  xhrMock.teardown();
});

it("create an instance of PredictiveSearchComponent", () => {
  const predictiveSearchComponent = createPredictiveSearchComponent();

  expect(predictiveSearchComponent).toBeInstanceOf(PredictiveSearchComponent);
});

it("throws on invalid config", () => {
  expect(() => {
    const predictiveSearchComponent = new PredictiveSearchComponent({
      selectors: {
        input: '[data-predictive-search-input="default"]',
        result: '[data-predictive-search-mount="default"]'
      },
      resultTemplateFct: "NOT A FUNCTION"
    });
  }).toThrow();

  expect(() => {
    const predictiveSearchComponent = new PredictiveSearchComponent({
      selectors: {
        input: '[data-predictive-search-input="default"]'
      },
      resultTemplateFct: defaultResultTemplateFct
    });
  }).toThrow();

  expect(() => {
    const predictiveSearchComponent = new PredictiveSearchComponent({
      selectors: {},
      resultTemplateFct: defaultResultTemplateFct
    });
  }).toThrow();

  expect(() => {
    const predictiveSearchComponent = new PredictiveSearchComponent({
      resultTemplateFct: defaultResultTemplateFct
    });
  }).toThrow();

  expect(() => {
    const predictiveSearchComponent = new PredictiveSearchComponent({
      selectors: {
        input: '[data-predictive-search-input="default"]',
        result: '[data-predictive-search-mount="default"]'
      }
    });
  }).toThrow();
});

it("on input focus, trigger the callback onInputFocus()", () => {
  const spyOnInputFocus = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onInputFocus: spyOnInputFocus
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evt = new Event("focus");
  input.dispatchEvent(evt);

  expect(spyOnInputFocus).toBeCalledTimes(1);
});

it("on input focus, when the input has a value, trigger open()", () => {
  const spy = jest.spyOn(PredictiveSearchComponent.prototype, "open");
  const predictiveSearchComponent = createPredictiveSearchComponent();

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  input.setAttribute("value", "abc");

  const evt = new Event("focus");
  input.dispatchEvent(evt);

  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
  expect(
    predictiveSearchComponent.nodes.result.classList.contains(
      predictiveSearchComponent.classes.visibleVariant
    )
  ).toBeTruthy();

  spy.mockRestore();
});

it("on input keyup, with at least one character, calls onBeforeOpen()", () => {
  const spy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onBeforeOpen: spy
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

it("has the ability to stop the event in onBeforeOpen()", () => {
  const spy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onBeforeOpen: () => false,
    onOpen: spy
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spy).not.toBeCalled();
  spy.mockRestore();
});

it("on input keyup, with at least one character, calls open()", () => {
  const spy = jest.spyOn(PredictiveSearchComponent.prototype, "open");
  const predictiveSearchComponent = createPredictiveSearchComponent();

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);

  jest.runAllTimers();

  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

it("on input keyup, with at least one character, calls onOpen() only once", () => {
  const spyOpen = jest.spyOn(PredictiveSearchComponent.prototype, "open");
  const spy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onOpen: spy
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.setAttribute("value", "abc");
  input.dispatchEvent(evtFocus);

  jest.runAllTimers();

  input.setAttribute("value", "def");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spyOpen).toBeCalledTimes(2);
  expect(spy).toBeCalledTimes(1);
  spyOpen.mockRestore();
  spy.mockRestore();
});

it("on input keyup, with no character, calls onBeforeClose()", () => {
  const spy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onBeforeClose: spy
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");
  const evtKeyupBackspace = new Event("keyup");
  evtKeyupBackspace.which = 8;

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  input.setAttribute("value", "");
  input.dispatchEvent(evtKeyupBackspace);

  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
});

it("has the ability to stop the event in onBeforeClose()", () => {
  const spy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onBeforeClose: () => false,
    onClose: spy
  });

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  input.setAttribute("value", "");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spy).not.toBeCalled();
});

it("on input keyup, with no character, calls close()", () => {
  const spy = jest.spyOn(PredictiveSearchComponent.prototype, "close");
  const predictiveSearchComponent = createPredictiveSearchComponent();

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");
  const evtKeyupBackspace = new Event("keyup");
  evtKeyupBackspace.which = 8;

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  input.setAttribute("value", "");
  input.dispatchEvent(evtKeyupBackspace);

  jest.runAllTimers();

  expect(spy).toBeCalledTimes(1);
  spy.mockRestore();
});

it("on input blur, call close()", () => {
  const spyOpen = jest.spyOn(PredictiveSearchComponent.prototype, "open");
  const spyClose = jest.spyOn(PredictiveSearchComponent.prototype, "close");
  const spyOnClose = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onClose: spyOnClose
  });
  let nodes = null;

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");
  const evtBlur = new Event("blur");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);
  nodes = {
    ...predictiveSearchComponent.nodes
  };

  jest.runAllTimers();

  expect(spyOpen).toBeCalledTimes(1);

  input.dispatchEvent(evtBlur);

  jest.runAllTimers();

  expect(spyOnClose).toBeCalledTimes(1);
  expect(nodes).toBeInstanceOf(Object);
  expect(spyOnClose).toHaveBeenNthCalledWith(1, nodes);

  spyOpen.mockRestore();
  spyClose.mockRestore();
});

it("on click inside the result dropdown, prevent closing", () => {
  const spyOpen = jest.spyOn(PredictiveSearchComponent.prototype, "open");
  const spyClose = jest.spyOn(PredictiveSearchComponent.prototype, "close");
  const predictiveSearchComponent = createPredictiveSearchComponent();

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const result = document.querySelector(
    '[data-predictive-search-mount="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");
  const evtBlur = new Event("blur");
  const evtMousedown = new Event("mousedown", {
    bubbles: true
  });

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spyOpen).toBeCalledTimes(1);

  result.dispatchEvent(evtMousedown);
  input.dispatchEvent(evtBlur);

  jest.runAllTimers();

  expect(spyClose).not.toBeCalled();

  spyOpen.mockRestore();
  spyClose.mockRestore();
});

it("closes the result dropdown on error", () => {
  xhrMock.teardown();
  xhrMock.setup();
  xhrMock.get(/^\/search\/suggest\.json/g, (req, res) => {
    return res
      .status(418)
      .header("Content-Type", "application/json")
      .body(
        JSON.stringify({
          name: "You've got tea?",
          message: "Because I'm a teapot!"
        })
      );
  });

  const spyHandlePredictiveSearchError = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handlePredictiveSearchError"
  );

  const predictiveSearchComponent = createPredictiveSearchComponent();

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spyHandlePredictiveSearchError).toHaveBeenCalled();
  expect(
    predictiveSearchComponent.nodes.result.classList.contains(
      predictiveSearchComponent.classes.visibleVariant
    )
  ).toBeFalsy();
  expect(predictiveSearchComponent.isResultVisible).toBeFalsy();
});

it("Doesn't perform a search if the search keyword hasn't change", () => {
  const spySearch = jest.spyOn(PredictiveSearchComponent.prototype, "_search");

  const predictiveSearchComponent = createPredictiveSearchComponent();
  const searchRequestSpy = jest.spyOn(
    predictiveSearchComponent.predictiveSearch,
    "query"
  );

  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );

  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  expect(spySearch).toHaveBeenCalledTimes(2);
  expect(searchRequestSpy).toHaveBeenCalledTimes(1);

  spySearch.mockRestore();
  searchRequestSpy.mockRestore();
});

it("When reset is clicked, the input value is cleared and results are closed", () => {
  const spyHandleInputResetEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleInputReset"
  );
  const predictiveSearchComponent = createPredictiveSearchComponent();
  const reset = document.querySelector(
    '[data-predictive-search-reset="default"]'
  );
  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );

  const evtFocus = new Event("focus");
  const evtKeyup = new Event("keyup");
  const evtClick = new Event("click");

  input.dispatchEvent(evtFocus);
  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);
  jest.runAllTimers();

  expect(input.value).toBe("abc");
  expect(
    predictiveSearchComponent.nodes.result.classList.contains(
      predictiveSearchComponent.classes.visibleVariant
    )
  ).toBeTruthy();
  expect(predictiveSearchComponent._searchKeyword).toBe("abc");

  reset.dispatchEvent(evtClick);

  expect(input.value).toBe("");
  expect(spyHandleInputResetEvt).toHaveBeenCalledTimes(1);
  expect(
    predictiveSearchComponent.nodes.result.classList.contains(
      predictiveSearchComponent.classes.visibleVariant
    )
  ).toBeFalsy();
  expect(predictiveSearchComponent._searchKeyword).toBe("");

  spyHandleInputResetEvt.mockRestore();
});

it("destroy()", () => {
  const spyHandleInputFocusEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleInputFocus"
  );
  const spyHandleInputBlurEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleInputBlur"
  );
  const spyHandleInputKeyupEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleInputKeyup"
  );
  const spyHandleInputResetEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleInputReset"
  );
  const spyHandleBodyMousedownEvt = jest.spyOn(
    PredictiveSearchComponent.prototype,
    "_handleBodyMousedown"
  );
  const spyOnBeforeKill = jest.fn();
  const spyOnDestroy = jest.fn();
  const predictiveSearchComponent = createPredictiveSearchComponent({
    onBeforeDestroy: spyOnBeforeKill,
    onDestroy: spyOnDestroy
  });
  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const reset = document.querySelector(
    '[data-predictive-search-reset="default"]'
  );
  const evtFocus = new Event("focus");
  const evtBlur = new Event("blur");
  const evtKeyup = new Event("keyup");
  const evtClick = new Event("click");
  const evtMousedown = new Event("mousedown", {
    bubbles: true
  });

  input.dispatchEvent(evtFocus);
  input.dispatchEvent(evtBlur);
  input.dispatchEvent(evtKeyup);
  reset.dispatchEvent(evtClick);
  document.body.dispatchEvent(evtMousedown);

  expect(spyHandleInputFocusEvt).toHaveBeenCalledTimes(2);
  expect(spyHandleInputBlurEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleInputResetEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleInputKeyupEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleBodyMousedownEvt).toHaveBeenCalledTimes(1);

  jest.runAllTimers();

  predictiveSearchComponent.destroy();

  predictiveSearchComponent.nodes.input.dispatchEvent(evtFocus);
  predictiveSearchComponent.nodes.input.dispatchEvent(evtBlur);
  predictiveSearchComponent.nodes.input.dispatchEvent(evtKeyup);
  predictiveSearchComponent.nodes.input.dispatchEvent(evtClick);
  document.body.dispatchEvent(evtMousedown);

  expect(spyHandleInputFocusEvt).toHaveBeenCalledTimes(2);
  expect(spyHandleInputBlurEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleInputKeyupEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleInputResetEvt).toHaveBeenCalledTimes(1);
  expect(spyHandleBodyMousedownEvt).toHaveBeenCalledTimes(1);

  expect(input.isSameNode(predictiveSearchComponent.nodes.input)).toBeTruthy();
  expect(spyOnBeforeKill).toBeCalledTimes(1);
  expect(spyOnDestroy).toBeCalledTimes(1);

  spyHandleInputFocusEvt.mockRestore();
  spyHandleInputBlurEvt.mockRestore();
  spyHandleInputKeyupEvt.mockRestore();
  spyHandleInputResetEvt.mockRestore();
});

/**  a11y tests  **/

it("supports arrow navigation", () => {
  const predictiveSearchComponent = createPredictiveSearchComponent();
  const input = document.querySelector(
    '[data-predictive-search-input="default"]'
  );
  const evtFocus = new Event("focus");
  const downArrowKeyCode = 40;
  const upArrowCode = 38;
  const evtKeyup = new Event("keyup");
  const evtKeyupArrowDown = new Event("keyup");
  evtKeyupArrowDown.keyCode = downArrowKeyCode;
  const evtKeyupArrowUp = new Event("keyup");
  evtKeyupArrowUp.keyCode = upArrowCode;

  input.dispatchEvent(evtFocus);

  input.setAttribute("value", "abc");
  input.dispatchEvent(evtKeyup);

  jest.runAllTimers();

  input.dispatchEvent(evtKeyupArrowDown);

  jest.runAllTimers();

  const results = document.querySelectorAll(
    predictiveSearchComponent.selectors.searchResult
  );
  const firstResult = results[0];
  const secondResult = results[1];

  expect(
    firstResult.classList.contains(
      predictiveSearchComponent.classes.itemSelected
    )
  ).toBeTruthy();

  input.dispatchEvent(evtKeyupArrowDown);

  expect(
    firstResult.classList.contains(
      predictiveSearchComponent.classes.itemSelected
    )
  ).toBeFalsy();

  expect(
    secondResult.classList.contains(
      predictiveSearchComponent.classes.itemSelected
    )
  ).toBeTruthy();

  input.dispatchEvent(evtKeyupArrowUp);

  expect(
    firstResult.classList.contains(
      predictiveSearchComponent.classes.itemSelected
    )
  ).toBeTruthy();

  expect(
    secondResult.classList.contains(
      predictiveSearchComponent.classes.itemSelected
    )
  ).toBeFalsy();

  jest.runAllTimers();
});