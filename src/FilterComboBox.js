import { getTextsFromItems } from './ItemsTextMixin.js';
import { merge } from "./updates";
import { stateChanged } from './utilities.js';
import { substantiveElement } from './content.js';
import * as symbols from './symbols.js';
import AutoCompleteInput from "./AutoCompleteInput.js";
import DelegateSelectionMixin from "./DelegateSelectionMixin";
import FilterListBox from "./FilterListBox.js";
import ListComboBox from "./ListComboBox.js";
import SlotContentMixin from './SlotContentMixin.js';


const previousStateKey = Symbol('previousSelection');


const Base =
  DelegateSelectionMixin(
  SlotContentMixin(
    ListComboBox
  ));


class FilterComboBox extends Base {

  [symbols.beforeUpdate]() {
    const inputRoleChanged = this[symbols.renderedRoles].inputRole !== this.state.inputRole;
    // const listRoleChanged = this[symbols.renderedRoles].listRole !== this.state.listRole;
    if (super[symbols.beforeUpdate]) { super[symbols.beforeUpdate](); }
    if (inputRoleChanged) {
      this.$.input.addEventListener('input', event => {
        this[symbols.raiseChangeEvents] = true;
        // const selectionStart = this.$.input.selectionStart;
        // this.setState({
        //   selectionStart
        // });
        const filter = event.detail ?
          event.detail.originalInput :
          this.state.value;
        this.setState({
          filter
        });
        this[symbols.raiseChangeEvents] = false;
      });
      // this.$.input.addEventListener('select', () => {
      //   this[symbols.raiseChangeEvents] = true;
      //   const selectionStart = this.$.input.selectionStart;
      //   this.setState({
      //     selectionStart
      //   });
      //   this[symbols.raiseChangeEvents] = false;
      // });
    }
    // if (listRoleChanged) {
    //   this.$.list.addEventListener('selected-index-changed', event => {
    //     /** @type {any} */
    //     const cast = event;
    //     const listSelectedIndex = cast.detail.selectedIndex;
    //     // Translate list index to our index.
    //     const listSelectedItem = this.$.list.items[listSelectedIndex];
    //     const selectedIndex = this.items.indexOf(listSelectedItem);
    //     this.setState({
    //       selectedIndex
    //     });
    //   });
    // }
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      filter: '',
      inputRole: AutoCompleteInput,
      listRole: FilterListBox,
      // selectionStart: 0
    });
  }

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    state[previousStateKey] = state[previousStateKey] || {
      content: null,
      filter: null,
      opened: false
    };
    const changed = stateChanged(state, state[previousStateKey]);
    const { content, filter, opened } = state;
    if (changed.content) {
      const items = state.content.filter(element => substantiveElement(element));
      const texts = getTextsFromItems(items);
      Object.assign(state, {
        contentForTexts: content,
        texts
      });
      result = false;
    }
    const closing = changed.opened && !opened;
    if (closing && filter) {
      // Closing resets the filter.
      state.filter = '';
      result = false;
    }

    return result;
  }

  get updates() {
    const { filter, selectedIndex, value } = this.state;
    // const selectedInputText = selectionStart > 0 ?
    //   this.value.slice(0, selectionStart) :
    //   null;
    // const filter = filter;
    const applyFilter = filter === '' || selectedIndex === -1;
    // const appliedFilter = selectedIndex === -1 ?
    //   filter :
    //   '';
    return merge(super.updates, {
      $: {
        input: Object.assign(
          {},
          'texts' in this.$.input && {
            texts: this.state.texts
          }
        ),
        list: Object.assign(
          {},
          applyFilter && {
            filter
          }
        )
        // list: {
        //   filter: appliedFilter
        // }
      }
    });
  }

}


export default FilterComboBox;
customElements.define('elix-filter-combo-box', FilterComboBox);
