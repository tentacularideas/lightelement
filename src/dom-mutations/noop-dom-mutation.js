import { DomMutation } from "./dom-mutation.js";

export class NoopDomMutation extends DomMutation {
  _statement;
  #firstPass;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this.#firstPass = true;
  }

  perform() {
    if (this.#firstPass) {
      this.#firstPass = false;
      this._statement.resolve();
      console.log(`[${this._lightElement.getTagName()}#${this._lightElement.getId()}][Scope#${this._statement.getScope().getId()}] Processing noop dom mutation...`);
      LightElement.processDomNode(this._statement.getScope(), this._lightElement, this._node, false);
    }
  }
}
