import DarkModeMixin from "../base/DarkModeMixin.js";
import { firstRender, render, template } from "../base/internal.js";
import SelectableButton from "../base/SelectableButton.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

const Base = DarkModeMixin(SelectableButton);

/**
 * A small dot component in the Plain reference design system
 *
 * This used as the default proxy element to represent items in carousels like
 * [PlainCarousel](PlainCarousel).
 *
 * @inherits SelectableButton
 * @mixes DarkModeMixin
 */
class PlainPageDot extends Base {
  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    if (this[firstRender]) {
      this.setAttribute("role", "none");
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          :host {
            background-color: black;
            border-radius: 7px;
            box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
            cursor: pointer;
            height: 8px;
            margin: 7px 5px;
            padding: 0;
            transition: opacity 0.2s;
            width: 8px;
          }

          :host([dark]) {
            background-color: white;
          }

          @media (min-width: 768px) {
            :host {
              height: 12px;
              width: 12px;
            }
          }
        </style>
      `
    );
    return result;
  }
}

export default PlainPageDot;
