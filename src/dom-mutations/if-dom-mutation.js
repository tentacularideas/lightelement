import { DomMutation } from "./dom-mutation.js";

export class IfDomMutation extends DomMutation {
  _statement;
  _hook;
  _template;
  #renderedNode;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._template = node;
    this._node = document.createComment("*if");
    this._template.replaceWith(this._node);
    this.#renderedNode = null;
  }

  perform() {
    const value = this._statement.resolve();

    if (value && !this.#renderedNode) {
      this.#renderedNode = this._template.cloneNode(true);
      console.log(`[${this._lightElement.getTagName()}#${this._lightElement.getId()}][Scope#${this._statement.getScope().getId()}] Processing if dom mutation...`);
      LightElement.processDomNode(this._statement.getScope(), this._lightElement, this.#renderedNode, false);
      this._node.after(this.#renderedNode);
    }

    else if (!value && this.#renderedNode) {
      this.#renderedNode.remove();
      this.#renderedNode = null;
    }
  }
}
