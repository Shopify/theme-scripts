/**
 * @jest-environment jsdom
 */

import {
  forceFocus,
  focusHash,
  bindInPageLinks,
  accessibleLinks
} from '../theme-a11y';

describe('forceFocus()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof forceFocus).toBe('function');
  });

  test("adds a 'tabindex=-1' attribute", () => {
    const nonFocusableElement = document.getElementById('nonFocusableElement');
    const focusableElement = document.getElementById('focusableElement');

    forceFocus(nonFocusableElement);
    expect(nonFocusableElement.tabIndex).toBe(-1);

    forceFocus(focusableElement);
    expect(focusableElement.tabIndex).toBe(-1);
  });

  test('reserves the original tabindex value in a data-tabIndex attribute', () => {
    const focusableElement = document.getElementById('focusableElement');

    focusableElement.tabIndex = 3;
    forceFocus(focusableElement);

    expect(parseInt(focusableElement.dataset.tabIndex, 10)).toBe(3);
  });

  test('adds a focus state', () => {
    const focusableElement = document.getElementById('focusableElement');

    forceFocus(focusableElement);

    expect(document.activeElement).toBe(focusableElement);
  });

  test('adds a class name if specified in the options', () => {
    const focusableElement = document.getElementById('focusableElement');
    const customClass = 'custom-class';
    forceFocus(focusableElement, {className: customClass});

    expect(focusableElement.classList.contains(customClass)).toBeTruthy();
  });

  test('resets the element to its original state on blur', () => {
    const focusableElement = document.getElementById('focusableElement');
    const nonFocusableElement = document.getElementById('nonFocusableElement');
    const clone = focusableElement.cloneNode(true);

    forceFocus(focusableElement);
    forceFocus(nonFocusableElement);

    expect(focusableElement).toEqual(clone);
  });
});

describe('focusHash()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="nonFocusableElement"></div>' +
      '<button id="focusableElement" tabIndex=3 class="myClass">';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof focusHash).toBe('function');
  });

  test('focuses an element whose ID is specified in the URL hash', () => {
    const focusableElement = document.getElementById('focusableElement');

    window.location.hash = 'focusableElement';
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });

  test('does not change the focus if element specified does not exist', () => {
    const focusableElement = document.getElementById('focusableElement');

    window.location.hash = 'otherElement';
    forceFocus(focusableElement);
    focusHash();

    expect(document.activeElement).toBe(focusableElement);
  });

  test('does not focus if element specified in the URL hash is ignored', () => {
    const body = document.getElementsByTagName('body');

    window.location.hash = 'focusableElement';
    focusHash({
      ignore: '#focusableElement'
    });

    expect(document.activeElement).toBe(body[0]);
  });
});

describe('bindInPageLinks()', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<a id="link" href="#title"></a>' +
      '<a id="invalidLink1" href="#"></a>' +
      '<a id="invalidLink2" href="/otherlink"></a>' +
      '<a id="ignoredLink" class="js-ignore-link" href="#title2"></a>' +
      '<h1 id="title">Title</h1>' +
      '<h2 id="title2">Title 2</h2>';
  });

  test('is a function exported by theme-a11y.js', () => {
    expect(typeof bindInPageLinks).toBe('function');
  });

  test('returns array of link elements that were binded and not ignored', () => {
    const links = bindInPageLinks({
      ignore: '.js-ignore-link'
    });

    expect(links.length).toBe(1);
    expect(links).toEqual(
      expect.not.arrayContaining(
        Array.from(document.querySelectorAll('.js-ignore-link'))
      )
    );
  });

  test("adds an event handler that focuses the element referred to in an <a> element w/ a href='#...' when it is clicked", () => {
    const link = document.getElementById('link');
    const title = document.getElementById('title');

    bindInPageLinks();

    link.click();

    expect(document.activeElement).toBe(title);
  });
});

describe('accessibleLinks()', () => {
  test('is a function exported by theme-a11y.js', () => {
    expect(typeof accessibleLinks).toBe('function');
  });

  test('outputs a HTML list of accessible messages', () => {
    document.body.innerHTML = `<a href="http://www.google.ca">Click me</a>`;

    accessibleLinks('a');
    const messagesOutput = document.querySelectorAll('li');
    expect(messagesOutput).toHaveLength(3);
  });

  test('overwrite default messages if parameters are provided', () => {
    document.body.innerHTML = `
      <a href="http://www.google.ca">Click me</a>
      <a href="/collections/shoes">Shoes</a>
    `;

    const messages = {
      newWindow: 'Opens in a new window.',
      external: 'Opens external website.',
      newWindowExternal: 'Opens external website in a new window.'
    };
    const keys = Object.keys(messages);

    accessibleLinks('a', {messages});
    const messagesOutput = Array.from(document.querySelectorAll('li'));

    const areMessagesMatched = messagesOutput.every((messageOutput, index) => {
      return messages[keys[index]] === messageOutput.innerHTML;
    });

    expect(areMessagesMatched).toBeTruthy();
  });

  test('adds aria-describedby attribute to external links', () => {
    document.body.innerHTML = `
      <a href="http://www.google.ca">Click me</a>
      <a href="/collections/shoes">Shoes</a>
      <a href="/collections/shoes/products/nike-free-run">Nike Free Run</a>
      <a href="http://www.cnn.com">CNN</a>
    `;

    accessibleLinks('a');
    const links = Array.from(document.querySelectorAll('a'));

    const externalLinks = links.filter(link => {
      return (
        link.hostname !== 'localhost' &&
        link.getAttribute('aria-describedby') !== null
      );
    });

    expect(externalLinks).toHaveLength(2);
  });

  test('adds rel="noopener" to links that open to a new window', () => {
    document.body.innerHTML = `
      <a href="/pages/summer-promotion" target="_blank">Summer promotion</a>
      <a href="http://www.cnn.com">CNN</a>
      <a href="http://www.shopify.com">Shopify</a>
    `;

    accessibleLinks('a');

    const links = Array.from(document.querySelectorAll('a'));
    const externalLinks = links.filter(link => {
      return (
        link.hostname === 'localhost' &&
        link.getAttribute('aria-describedby') === 'a11y-new-window-message'
      );
    });

    expect(externalLinks).toHaveLength(1);
    expect(externalLinks[0].getAttribute('rel')).toBe('noopener');
  });

  test('adds rel="noopener" to links that are external and open to a new window', () => {
    document.body.innerHTML = `
      <a href="http://www.cnn.com" target="_blank">CNN</a>
      <a href="http://www.google.ca" target="_blank">Google</a>
      <a href="http://www.shopify.ca">Shopify</a>
    `;
    accessibleLinks('a');

    const links = Array.from(document.querySelectorAll('a'));
    const externalLinksNoopener = links.filter(link => {
      return (
        link.getAttribute('rel') === 'noopener' &&
        link.getAttribute('aria-describedby') ===
          'a11y-new-window-external-message'
      );
    });
    expect(externalLinksNoopener).toHaveLength(2);
  });

  test('shows a different accessible message when a link is external and opens to a new window', () => {
    document.body.innerHTML = `
      <a href="http://www.cnn.com" target="_blank">CNN</a>
    `;
    accessibleLinks('a');
    const externalLinks = document.querySelectorAll('a');
    expect(externalLinks[0].getAttribute('aria-describedby')).toBe(
      'a11y-new-window-external-message'
    );
  });

  test('targets only specific elements', () => {
    document.body.innerHTML = `
      <a href="http://www.facebook.com" class="links-menu" target="_blank">Share on Facebook</a>
      <a href="http://www.twitter.com" class="links-menu" target="_blank">Share on Twitter</a>
      <a href="http://www.shopify.com">Powered by Shopify</a>
    `;

    accessibleLinks('.links-menu');

    const externalLinks = Array.from(document.querySelectorAll('a'));
    const externalLinksSelected = externalLinks.filter(link => {
      return link.getAttribute('aria-describedby') !== null;
    });
    expect(externalLinksSelected).toHaveLength(2);
  });

  test('changes the prefix of the ID key of the message', () => {
    document.body.innerHTML = `
      <a href="http://www.google.ca">Click me</a>
      <a href="/collections/shoes">Shoes</a>
    `;

    accessibleLinks('a', {
      prefix: 'shopify'
    });
    const messagesOutput = document.querySelectorAll('li');
    const expected = 'shopify-new-window-message';
    expect(messagesOutput[0].getAttribute('id')).toBe(expected);
  });

  test('throws error when target elements is invalid', () => {
    document.body.innerHTML = `<a href="http://www.google.ca">Click me</a>`;

    expect(() => {
      accessibleLinks();
    }).toThrow();

    expect(() => {
      accessibleLinks(['a']);
    }).toThrow();
  });

  test('returns silently when there are no results', () => {
    expect(accessibleLinks('strong')).toBeUndefined();
  });
});
