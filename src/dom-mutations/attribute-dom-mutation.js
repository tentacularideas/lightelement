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
    // Warning: this will not work with not LightElement custom elements.
    if (this._node.tagName.includes("-") && !this._node.isConnected && !!customElements.get(this._node.tagName.toLowerCase())) {
      if (!this._node._leDelayedDomMutations) {
        this._node._leDelayedDomMutations = [];
      }

      this._node._leDelayedDomMutations.push(this);
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
