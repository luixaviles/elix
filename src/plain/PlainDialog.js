import * as internal from "../base/internal.js";
import Dialog from "../base/Dialog.js";
import PlainModalBackdrop from "./PlainModalBackdrop.js";
import PlainOverlayFrame from "./PlainOverlayFrame.js";

/**
 * Dialog component in the Plain reference design system
 *
 * @inherits Dialog
 */
class PlainDialog extends Dialog {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      backdropPartType: PlainModalBackdrop,
      framePartType: PlainOverlayFrame
    });
  }
}

export default PlainDialog;
