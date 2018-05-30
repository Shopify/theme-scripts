/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 */

/**
 * For use when focus shifts to a container rather than a link
 * eg for In-page links, after scroll, focus shifts to content area so that
 * next `tab` is where user expects if focusing a link, just $link.focus();
 */
export function pageLinkFocus(element, config = {}) {
  const { className = "js-focus-hidden" } = config;
  const savedTabIndex = element.tabIndex;

  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  element.classList.add(className);
  element.addEventListener("blur", callback);

  function callback(event) {
    event.target.removeEventListener(event.type, callback);

    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    element.classList.remove(className);
  }
}

/**
 * If there's a hash in the url, focus the appropriate element
 */

export function focusHash() {
  const hash = window.location.hash;
  const element = document.getElementById(hash.slice(1));
  // is there a hash in the url? is it an element on the page?

  if (hash && element) {
    pageLinkFocus(element);
  }
}

/**
 * When an in-page (url w/hash) link is clicked, focus the appropriate element
 */
export function bindInPageLinks() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    const element = document.querySelector(link.hash);

    if (!element) {
      return;
    }

    link.addEventListener("click", () => {
      pageLinkFocus(element);
    });
  });
}

export function focusable(container) {
  return container.querySelectorAll(`
    [tabindex],
    [draggable],
    a[href],
    area,
    button:enabled,
    input:not([type=hidden]):enabled,
    link[href],
    object,
    select:enabled,
    textarea:enabled`);
}

/**
 * Traps the focus in a particular container
 *
 * @param {object} options - Options to be used
 * @param {jQuery} options.$container - Container to trap focus within
 * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
 * @param {string} options.namespace - Namespace used for new focus event handler
 */

const trapFocusHandlers = {};

export function trapFocus(container, elementToFocus = container) {
  const elements = focusable(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = function(event) {
    if (container !== event.target && !container.contains(event.target)) {
      first.focus();
    }

    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function(event) {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return; // If not TAB key

    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  pageLinkFocus(elementToFocus);
}

/**
 * Removes the trap of focus in a particular container
 *
 * @param {object} options - Options to be used
 * @param {jQuery} options.$container - Container to trap focus within
 * @param {string} options.namespace - Namespace used for new focus event handler
 */
export function removeTrapFocus() {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
}
