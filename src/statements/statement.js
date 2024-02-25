export class Statement {
  static #nextId = 1;

  #id;
  _target;
  _statement;
  _scope;

  constructor(statement, target = null, scope = null) {
    this.#id = Statement.#nextId++;
    this._target = target;
    this._statement = statement;
    this._scope = scope;
  }

  getId() {
    return this.#id;
  }

  getScope() {
    return this._scope;
  }

  resolve() {}
}
