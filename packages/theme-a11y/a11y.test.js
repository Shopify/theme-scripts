/**
 * @jest-environment jsdom
 */

import path from "path";
import {
  pageLinkFocus,
  focusHash,
  bindInPageLinks,
  focusable,
  trapFocus,
  removeTrapFocus
} from "./a11y";

describe("pageLinkFocus()", () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test("is a function exported by a11y.js", () => {
    expect(typeof pageLinkFocus).toBe("function");
  });

  test("adds a 'tabindex=-1' attribute", () => {
    const nonFocusableElement = document.getElementById("nonFocusableElement");
    const focusableElement = document.getElementById("focusableElement");

    pageLinkFocus(nonFocusableElement);
    expect(nonFocusableElement.tabIndex).toBe(-1);

    pageLinkFocus(focusableElement);
    expect(focusableElement.tabIndex).toBe(-1);
  });

  test("reserves the original tabindex value in a data-tabIndex attribute", () => {
    const focusableElement = document.getElementById("focusableElement");

    focusableElement.tabIndex = 3;
    pageLinkFocus(focusableElement);

    expect(parseInt(focusableElement.dataset.tabIndex)).toBe(3);
  });

  test("adds a focus state", () => {
    const focusableElement = document.getElementById("focusableElement");

    pageLinkFocus(focusableElement);

    expect(document.activeElement).toBe(focusableElement);
  });

  test("adds the default class name 'js-focus-hidden'", () => {
    const focusableElement = document.getElementById("focusableElement");
    const defaultClass = "js-focus-hidden";
    pageLinkFocus(focusableElement);

    expect(focusableElement.classList.contains(defaultClass)).toBeTruthy();
  });

  test("adds an overrided class name", () => {
    const focusableElement = document.getElementById("focusableElement");
    const customClass = "custom-class";
    pageLinkFocus(focusableElement, { className: customClass });

    expect(focusableElement.classList.contains(customClass)).toBeTruthy();
  });

  test("resets the element to its original state on blur", () => {
    const focusableElement = document.getElementById("focusableElement");
    const nonFocusableElement = document.getElementById("nonFocusableElement");
    const clone = focusableElement.cloneNode(true);

    pageLinkFocus(focusableElement);
    pageLinkFocus(nonFocusableElement);

    expect(focusableElement).toEqual(clone);
  });
});

describe("focusHash()", () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test("is a function exported by a11y.js", () => {
    expect(typeof focusHash).toBe("function");
  });

  test("focuses an element whose ID is specified in the URL hash", () => {
    const focusableElement = document.getElementById("focusableElement");

    window.location.hash = "focusableElement";
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });

  test("does not change the focus if element specified does not exist", () => {
    const focusableElement = document.getElementById("focusableElement");

    window.location.hash = "otherElement";
    pageLinkFocus(focusableElement);
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });
});

describe("bindInPageLinks()", () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<a id="link" href="#title"></a>' + '<h1 id="title">Title</h1>';
  });

  test("is a function exported by a11y.js", () => {
    expect(typeof bindInPageLinks).toBe("function");
  });

  test("adds an event handler that focuses the element referred to in an <a> element w/ a href='#...' when it is clicked", () => {
    const link = document.getElementById("link");
    const title = document.getElementById("title");

    bindInPageLinks();

    link.click();
    expect(document.activeElement).toBe(title);
  });
});

describe("focusable()", () => {
  function expectElements(valid, invalid) {
    const matchIds = [];

    focusable(document).forEach(element => matchIds.push(element.id));

    expect(matchIds).toEqual(expect.arrayContaining(valid));
    expect(matchIds).not.toEqual(expect.arrayContaining(invalid));
  }

  test("is a function exported by a11y.js", () => {
    expect(typeof focusable).toBe("function");
  });

  test("selects valid <a> elements", () => {
    document.body.innerHTML = `
      <a id="withHref" href="#title"></a>
      <a id="withoutHref"></a>`;

    const valid = ["withHref"];
    const invalid = ["withoutHref"];

    expectElements(valid, invalid);
  });

  test("selects valid <area> elements", () => {
    document.body.innerHTML = `
      <a id="withHref" href="#title"></a>
      <a id="withoutHref"></a>`;

    const valid = ["withHref"];
    const invalid = ["withoutHref"];

    expectElements(valid, invalid);
  });

  test("selects enabled <button> elements", () => {
    document.body.innerHTML = `
      <button id="button"></button>
      <button id="disabledButton" disabled></button>`;

    const valid = ["button"];
    const invalid = ["disabledButton"];

    expectElements(valid, invalid);
  });

  test("selects enabled, non-hidden input elements", () => {
    document.body.innerHTML = `
      <input type="text" id="input"></input>
      <input type="hidden" id="hiddenInput"></input>`;

    const valid = ["input"];
    const invalid = ["hiddenInput"];

    expectElements(valid, invalid);
  });

  test("selects valid <link> elements", () => {
    document.body.innerHTML = `
      <link id="validLink" href="#something">
      <link id="invalidLink">`;

    const valid = ["validLink"];
    const invalid = ["invalidLink"];

    expectElements(valid, invalid);
  });

  test("selects valid <object> elements", () => {
    document.body.innerHTML = `
    <object id="object" data="movie.swf" type="application/x-shockwave-flash" />`;

    const valid = ["object"];
    const invalid = [""];

    expectElements(valid, invalid);
  });

  test("selects enabled <select> elements", () => {
    document.body.innerHTML = `
    <select id="validSelect">
      <option val="1">1</option>
    </select>
    <select id="disabledSelect" disabled>
      <option val="1">1</option>
    </select>`;

    const valid = ["validSelect"];
    const invalid = ["disabledSelect"];

    expectElements(valid, invalid);
  });

  test("selects enabled <textarea> elements", () => {
    document.body.innerHTML = `
    <textarea id="validTextArea"></textarea>
    <textarea id="disabledTextArea" disabled></textarea>`;

    const valid = ["validTextArea"];
    const invalid = ["disabledTextArea"];

    expectElements(valid, invalid);
  });

  test("selects elements with tabindex attribute", () => {
    document.body.innerHTML = `
    <div id="withTabIndex" tabindex="-1"></div>
    <div id="withoutTabIndex"></div>`;

    const valid = ["withTabIndex"];
    const invalid = ["withoutTabIndex"];

    expectElements(valid, invalid);
  });

  test("selects elements with draggable attribute", () => {
    document.body.innerHTML = `
    <div id="draggableTrue" draggable="true"></div>
    <div id="draggableFalse" draggable="true"></div>
    <div id="withoutDraggable"></div>`;

    const valid = ["draggableTrue"];
    const invalid = ["draggableFalse, withoutDraggable"];

    expectElements(valid, invalid);
  });
});

describe("trapFocus()", () => {
  test("is a function exported by a11y.js", () => {
    expect(typeof trapFocus).toBe("function");
  });
});

describe("removeTrapFocus()", () => {
  test("is a function exported by a11y.js", () => {
    expect(typeof removeTrapFocus).toBe("function");
  });
});
