import {
  defaultState,
  keydown,
  setState,
  state,
} from "../../src/base/internal.js";
import ItemsTextMixin from "../../src/base/ItemsTextMixin.js";
import KeyboardPrefixCursorMixin from "../../src/base/KeyboardPrefixCursorMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";
import { assert } from "../testHelpers.js";

const Base = ItemsTextMixin(
  KeyboardPrefixCursorMixin(ReactiveMixin(HTMLElement))
);

class KeyboardPagedCursorTest extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentIndex: -1,
    });
  }

  get items() {
    return this[state].items;
  }
  set items(items) {
    this[setState]({ items });
  }
}
customElements.define("keyboard-prefix-cursor-test", KeyboardPagedCursorTest);

describe("KeyboardPrefixCursorMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("selects the first item that begins with the typed prefix", () => {
    const fixture = createSampleElement();
    const prefix = "blu"; // The keys we'll simulate.

    // Typing "b" moves to "Banana".
    simulateKeydown(fixture, prefix[0]);
    assert.equal(fixture[state].currentIndex, 4);

    // Typing "l" moves to "Blackberry".
    simulateKeydown(fixture, prefix[1]);
    assert.equal(fixture[state].currentIndex, 5);

    // Typing "u" moves to "Blueberry".
    simulateKeydown(fixture, prefix[2]);
    assert.equal(fixture[state].currentIndex, 6);
  });

  it("backspace removes the last character added to the prefix", () => {
    const fixture = createSampleElement();
    const prefix = "bl"; // The keys we'll simulate.

    // Typing "b" moves to "Banana".
    simulateKeydown(fixture, prefix[0]);
    assert.equal(fixture[state].currentIndex, 4);

    // Typing "l" moves to "Blackberry".
    simulateKeydown(fixture, prefix[1]);
    assert.equal(fixture[state].currentIndex, 5);

    // Typing Backspace moves back to "Banana".
    simulateKeydown(fixture, "Backspace");
    assert.equal(fixture[state].currentIndex, 4);
  });

  it("ignores typed keys that don't match", () => {
    const fixture = createSampleElement();
    // Typing "x" leaves selection alone (since it doesn't match).
    simulateKeydown(fixture, "x");
    assert.equal(fixture[state].currentIndex, -1);
  });

  it("treats spaces in the typed prefix like regular characters", () => {
    const fixture = createSampleElement();
    const prefix = "dried "; // The keys we'll simulate.

    // Typing "dried" moves to "Dried Apricot".
    simulateKeydown(fixture, prefix[0]);
    simulateKeydown(fixture, prefix[1]);
    simulateKeydown(fixture, prefix[2]);
    simulateKeydown(fixture, prefix[3]);
    simulateKeydown(fixture, prefix[4]);
    assert.equal(fixture[state].currentIndex, 10);

    // Typing " " stays on "Dried Apricot".
    simulateKeydown(fixture, prefix[5]);
    assert.equal(fixture[state].currentIndex, 10);

    // Typing "c" moves to "Dried Cherry".
    simulateKeydown(fixture, "c");
    assert.equal(fixture[state].currentIndex, 11);
  });

  it("is case-insensitive in matching prefixes", () => {
    const fixture = createSampleElement();
    simulateKeydown(fixture, "c");
    assert.equal(fixture[state].currentIndex, 7); // Cherry
    simulateKeydown(fixture, "Escape"); // Escape key resets prefix
    simulateKeydown(fixture, "B");
    assert.equal(fixture[state].currentIndex, 4); // Banana
  });
});

function createSampleElement() {
  const fixture = new KeyboardPagedCursorTest();
  const texts = [
    "Acai",
    "Acerola",
    "Apple",
    "Apricot",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cantaloupe",
    "Cherry",
    "Cranberry",
    "Dried Apricot",
    "Dried Cherry",
  ];
  const items = texts.map((text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div;
  });
  fixture.items = items;
  return fixture;
}

function simulateKeydown(fixture, key) {
  const keyCode = key.length === 1 ? key.charCodeAt(0) : null;
  fixture[keydown]({
    key,
    keyCode,
  });
}
