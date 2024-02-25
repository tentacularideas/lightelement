import { ReturnStatement } from "./return-statement.js";

export class LetStatement extends ReturnStatement {
  #variableName;

  constructor(variableName, statement, target = null, scope = null) {
    super(statement, target, scope);
    this.#variableName = variableName;
  }

  resolve() {
    this._scope.setVariable(this.#variableName, super.resolve());
    return true;
  }
}
