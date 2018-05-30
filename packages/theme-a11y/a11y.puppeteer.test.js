import { pageLinkFocus, focusable, trapFocus, removeTrapFocus } from "./a11y";

beforeEach(async () => {
  // This is a super smelly way of exposing the functions needed to perform the
  // tests I want. Would love a better way!
  await page.setContent(`
  <script type="module">
    window.trapFocusHandlers = {};
    window.removeTrapFocus = ${removeTrapFocus.toString()};
    window.pageLinkFocus = ${pageLinkFocus.toString()};
    window.focusable = ${focusable.toString()};
    window.trapFocus = ${trapFocus.toString()};
  </script>
  <a id="outsideLink" href="#">Some outside link</a>
  <div id="container">
    <input id="textInput1" type="text" />
    <input id="textInput2" type="text" />
    <button id="button">Some button</button>
  </div>
  <div id="container2">
    <input id="textInput3" type="text" />
  </div>`);
});

describe("trapFocus()", () => {
  test("sets the intial focus on the container by default", async () => {
    await page.evaluate(() => {
      const container = document.getElementById("container");
      window.trapFocus(container);
    });

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe("container");
  });

  test("accepts an optional second parameter to specify what element to initially focus on", async () => {
    await page.evaluate(() => {
      const container = document.getElementById("container");
      const input2 = document.getElementById("textInput2");
      window.trapFocus(container, input2);
    });

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe("textInput2");
  });

  test("focuses the first tabable element after tabbing the last tabable element in a container", async () => {
    await page.evaluate(() => {
      const container = document.getElementById("container");
      window.trapFocus(container);
    });

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe("textInput1");
  });

  test("focuses on the last tabable element when shift-tabbing from first tabbable element", async () => {
    await page.evaluate(() => {
      const container = document.getElementById("container");
      window.trapFocus(container);
    });

    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe("textInput1");
  });

  test("focuses first tabable element if focus leaves the container", async () => {
    const activeElement = await page.evaluate(() => {
      const container = document.getElementById("container");
      const outsideLink = document.getElementById("outsideLink");

      window.trapFocus(container);
      outsideLink.focus();

      return document.activeElement.id;
    });

    await expect(activeElement).toBe("textInput1");
  });

  test("removes the previous trapFocus() before applying applying a new instance of trapFocus()", async () => {
    await page.evaluate(() => {
      window.trapFocus(document.getElementById("container"));
      window.trapFocus(document.getElementById("container2"));
    });

    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe("textInput3");
  });
});
