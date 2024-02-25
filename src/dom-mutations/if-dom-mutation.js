import { DomMutation } from "./dom-mutation.js";

export class IfDomMutation extends DomMutation {
  _statement;
  _hook;
  _template;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._template = node;
    this._node = null;
  }

  perform() {
    // TODO: First call, to be optimized
    if (!this._hook) {
      this._hook = document.createComment("*if");
      this._template.replaceWith(this._hook);
    }

    const value = this._statement.resolve();

    if (value && !this._node) {
      this._node = this._template.cloneNode(true);
      console.log(`[${this._lightElement.getTagName()}#${this._lightElement.getId()}][Scope#${this._statement.getScope().getId()}] Processing if dom mutation...`);
      LightElement.processDomNode(this._statement.getScope(), this._lightElement, this._node, false);
      this._hook.after(this._node);
    }

    else if (!value && this._node) {
      this._node.remove();
      this._node = null;
    }
  }
}
