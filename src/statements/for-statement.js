import { Statement } from "./statement.js";

export class ForStatement extends Statement {
  #fn;
  #variable;
  #iterable;

  constructor(statement, target = null, scope = null) {
    super(statement, target, scope);

    const parsedStatement = this.constructor.#parseStatement(statement);
    this.#variable = parsedStatement.variable;
    this.#iterable = parsedStatement.iterable;
    this.#fn = scope.createGeneratorStatement(`for (let ${this.#variable} of ${this.#iterable} || []) { yield ${this.#variable}; }`);
  }

  static #parseStatement(statement) {
    const matches = statement.match(/^\s*let\s+(?<variable>[a-zA-Z][a-zA-Z0-9_]*)\s+of\s+(?<iterable>[a-zA-Z][a-zA-Z0-9_\\?.\[\]\(\)\'\"]*)\s*$/);

    if (!matches) {
      throw new Error(`Invalid *for statement: "${statement}".`);
    }

    return {
      variable: matches.groups["variable"],
      iterable: matches.groups["iterable"],
    };
  }

  getVariableName() {
    return this.#variable;
  }

  getDependencies() {
    return [this.#iterable];
  }

  *resolve() {
    for (let item of this.#fn()) {
      yield item;
    }
  }
}
