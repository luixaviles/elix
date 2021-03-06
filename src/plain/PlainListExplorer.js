import { defaultState } from "../base/internal.js";
import ListExplorer from "../base/ListExplorer.js";
import PlainListBox from "./PlainListBox.js";

/**
 * ListExplorer component in the Plain reference design system
 *
 * @inherits ListExplorer
 * @part {PlainListBox} proxy-list
 */
class PlainListExplorer extends ListExplorer {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyListPartType: PlainListBox,
    });
  }
}

export default PlainListExplorer;
