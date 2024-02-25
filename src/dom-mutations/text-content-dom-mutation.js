import { DomMutation } from "./dom-mutation.js";

export class TextContentDomMutation extends DomMutation {
  _statement;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
  }

  perform() {
    this._node.textContent = `${this._statement.resolve()}`;
  }
}