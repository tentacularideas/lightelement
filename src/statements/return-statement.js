import { Statement } from "./statement.js";

export class ReturnStatement extends Statement {
  #fn;

  constructor(statement, target = null, scope = null) {
    super(statement, target, scope);

    // TODO: handle more complex cases
    this.#fn = this._scope.createStatement(`return (${this._statement || null});`);
  }

  getDependencies() {
    return this._scope.getDependenciesFromStatement(this._statement);
  }

  resolve() {
    return this.#fn();
  }
}
