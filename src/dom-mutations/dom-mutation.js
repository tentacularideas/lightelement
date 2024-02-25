export class DomMutation {
  _lightElement;
  _node;

  constructor(lightElement, node) {
    this._lightElement = lightElement;
    this._node = node;
  }

  perform() {}
}
