import {
  pageLinkFocus,
  focusable,
  trapFocus,
  removeTrapFocus
} from './theme-a11y';

describe('trapFocus()', () => {
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
      <button id="hiddenButton" style="display:none;">Hidden button</button>
    </div>
    <div id="container2">
      <input id="textInput3" type="text" />
    </div>`);
  });

  test('sets the intial focus on the container by default', async () => {
    await page.evaluate(() => {
      const container = document.getElementById('container');
      window.trapFocus(container);
    });

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe('container');
  });

  test('accepts an optional second parameter to specify what element to initially focus on', async () => {
    await page.evaluate(() => {
      const container = document.getElementById('container');
      const input2 = document.getElementById('textInput2');
      window.trapFocus(container, input2);
    });

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe('textInput2');
  });

  test('focuses the first tabable element after tabbing the last tabable element in a container', async () => {
    await page.evaluate(() => {
      const container = document.getElementById('container');
      const lastElement = document.getElementById('button');
      window.trapFocus(container);
    });

    await page.keyboard.press('Tab');

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe('textInput1');
  });

  test('focuses on the last tabable and visible element when shift-tabbing from first tabbable element', async () => {
    await page.evaluate(() => {
      const container = document.getElementById('container');
      window.trapFocus(container);
    });

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe('button');
  });

  test('focuses first tabable and visible element if focus leaves the container', async () => {
    const activeElement = await page.evaluate(() => {
      const container = document.getElementById('container');
      const outsideLink = document.getElementById('outsideLink');

      window.trapFocus(container);
      outsideLink.focus();

      return document.activeElement.id;
    });

    await expect(activeElement).toBe('textInput1');
  });

  test('removes the previous trapFocus() before applying applying a new instance of trapFocus()', async () => {
    await page.evaluate(() => {
      window.trapFocus(document.getElementById('container'));
      window.trapFocus(document.getElementById('container2'));
    });

    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');

    const activeElement = await page.evaluate(() => document.activeElement.id);

    await expect(activeElement).toBe('textInput3');
  });
});

describe('focusable()', () => {
  async function expectElements(valid, invalid) {
    const matchIds = await page.evaluate(() => {
      var ids = [];
      window.focusable(document).forEach(element => ids.push(element.id));
      return ids;
    });

    expect(matchIds).toEqual(expect.arrayContaining(valid));

    if (typeof invalid !== 'undefined') {
      expect(matchIds).not.toEqual(expect.arrayContaining(invalid));
    }
  }

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof focusable).toBe('function');
  });

  test('selects valid <a> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <a id="withHref" href="#title"></a>
      <a id="withoutHref"></a>
    `);

    const valid = ['withHref'];
    const invalid = ['withoutHref'];

    await expectElements(valid, invalid);
  });

  test('selects valid <area> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <map>
        <area id="area" href="#title" />
      </map>
    `);

    const valid = ['area'];

    await expectElements(valid);
  });

  test('selects enabled <button> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <button id="button"></button>
      <button id="disabledButton" disabled></button>
    `);

    const valid = ['button'];
    const invalid = ['disabledButton'];

    await expectElements(valid, invalid);
  });

  test('selects enabled, non-hidden input elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <input type="text" id="input"></input>
      <input type="hidden" id="hiddenInput"></input>
    `);

    const valid = ['input'];
    const invalid = ['hiddenInput'];

    await expectElements(valid, invalid);
  });

  test('selects valid <object> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <object id="object" data="movie.swf" type="application/x-shockwave-flash" />
    `);

    const valid = ['object'];

    await expectElements(valid);
  });

  test('selects enabled <select> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <select id="validSelect">
        <option val="1">1</option>
      </select>
      <select id="disabledSelect" disabled>
        <option val="1">1</option>
      </select>
    `);

    const valid = ['validSelect'];
    const invalid = ['disabledSelect'];

    await expectElements(valid, invalid);
  });

  test('selects enabled <textarea> elements', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <textarea id="validTextArea"></textarea>
      <textarea id="disabledTextArea" disabled></textarea>
    `);

    const valid = ['validTextArea'];
    const invalid = ['disabledTextArea'];

    await expectElements(valid, invalid);
  });

  test('selects elements with tabindex attribute', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <div id="withTabIndex" tabindex="-1"></div>
      <div id="withoutTabIndex"></div>
    `);

    const valid = ['withTabIndex'];
    const invalid = ['withoutTabIndex'];

    await expectElements(valid, invalid);
  });

  test('selects elements with draggable attribute', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <div id="draggableTrue" draggable="true"></div>
      <div id="draggableFalse" draggable="false"></div>
      <div id="withoutDraggable"></div>
    `);

    const valid = ['draggableTrue'];
    const invalid = ['draggableFalse', 'withoutDraggable'];

    await expectElements(valid, invalid);
  });

  test('selects only elements which are visible', async () => {
    await page.setContent(`
      <script type="module">
        window.focusable = ${focusable.toString()};
      </script>
      <button id="visibleButton"></button>
      <button id="transparentButton"></button>
      <button id="hiddenButton" style="display:none;"></button>
      <div style="display:none;">
        <button id="hiddenChildButton"></button>
      </div>
    `);

    const valid = ['visibleButton', 'transparentButton'];
    const invalid = ['hiddenButton', 'hiddenChildButton'];

    await expectElements(valid, invalid);
  });
});

describe('trapFocus()', () => {
  test('is a function exported by theme-a11y.js', () => {
    expect(typeof trapFocus).toBe('function');
  });
});

describe('removeTrapFocus()', () => {
  test('is a function exported by theme-a11y.js', () => {
    expect(typeof removeTrapFocus).toBe('function');
  });
});
