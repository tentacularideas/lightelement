import { DomMutation } from "./dom-mutation.js";

export class AttributeDomMutation extends DomMutation {
  _attribute;
  _statement;

  constructor(lightElement, node, attribute, statement) {
    super(lightElement, node);
    this._attribute = attribute;
    this._statement = statement;
  }

  perform() {
    // Delay attribute mutation if a custom element is not connected yet
    // Warning: this change can be invoked after a more recent one!
    if (!this._node.isConnected && !!customElements.get(this._node.tagName.toLowerCase())) {
      customElements.whenDefined(this._node.tagName.toLowerCase()).then(() => {
        this.perform();
      });
      return;
    }

    const value = this._statement.resolve();

    if (value === true) {
      this._node.setAttribute(this._attribute, "");
    }
    else if (value === false) {
      this._node.removeAttribute(this._attribute);
    }
    else {
      this._node.setAttribute(this._attribute, value);
    }
  }
}
