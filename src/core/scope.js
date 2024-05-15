export class Scope {
  static #nextId = 1;
  #id;
  #scopes;
  #parentScope;
  #mutations;
  #instance;
  #variables;
  
  constructor(instance) {
    this.#id = Scope.#nextId++;
    this.#scopes = new Set();
    this.#parentScope = null;
    this.#mutations = new Map();
    this.#instance = instance;
    this.#variables = new Map();
  }

  getId() {
    return this.#id;
  }
  
  addScope(scope) {
    this.#scopes.add(scope);
    scope.setParentScope(this);
  }
  
  removeScope(scope) {
    this.#scopes.remove(scope);
  }
  
  setParentScope(scope) {
    this.#parentScope = scope;
  }
  
  addMutation(variable, mutation) {
    if (this.#mutations.has(variable)) {
      this.#mutations.get(variable).push(mutation);
    }
    else {
      this.#mutations.set(variable, [mutation]);
    }

    // WARN: may run multiple time if a mutation is link to multiple variables
    mutation.perform();
  }
  
  addMutations(variable, mutations) {
    if (this.#mutations.has(variable)) {
      this.#mutations.get(variable).push(...mutations);
    }
    else {
      this.#mutations.set(variable, mutations);
    }

    // WARN: may run multiple time if a mutation is link to multiple variables
    if (mutations && mutations.length) {
      mutations.forEach((mutation) => {
        mutation.perform();
      });
    }
  }
  
  setVariable(name, value) {
    this.#variables.set(name, value);
  }
  
  getVariables() {
    return Object.fromEntries(this.#variables.entries());
  }

  #createStatementBody(...body) {
    const variables = [];

    for (let variable of this.#variables.keys()) {
      const value = this.#variables.get(variable);
      let rightPart = JSON.stringify(value).replace(/"/g, "\\\"");
      variables.push(`const ${variable} = JSON.parse("${rightPart}");`);
    }

    return variables.join("") + body;
  }
  
  createStatement(...argsAndBody) {
    const body = argsAndBody.pop() || "";
    return (new Function(...argsAndBody, this.#createStatementBody(body))).bind(this.#instance);
  }

  createGeneratorStatement(...argsAndBody) {
    const GeneratorFunction = function*() {}.constructor;
    const body = argsAndBody.pop() || "";
    return (new GeneratorFunction(...argsAndBody, this.#createStatementBody(body))).bind(this.#instance);
  }

  getDependenciesFromStatement(body) {
    // Extract dependencies from statement by running it with a Proxy.
    // WARNING: It only works with simple straightforward statements. 
    const dependencies = [];

    const variables = [];
    for (let variable of this.#variables.keys()) {
      const value = this.#variables.get(variable);
      let rightPart = JSON.stringify(value).replace(/"/g, "\\\"");
      variables.push(`const ${variable} = JSON.parse("${rightPart}");`);
      dependencies.push(variable);
    }
    const functionBody = variables.join("") + body;

    (new Function(functionBody)).bind(new Proxy(this.#instance, {
      get(target, property) {
        dependencies.push(`this.${property}`);
        return target[property];
      },
    }))();

    return dependencies;
  }
  
  createVariation(variable, value) {
    const variation = new Scope(this.#instance);
    variation.setVariable(variable, value);
    this.addScope(variation);
    return variation;
  }
  
  update(variable = null) {
    if (variable == null) {
      for (let mutationVariable of this.#mutations.keys()) {
        this.update(mutationVariable);
      }
    
      return;
    }
    
    console.log(`[Scope#${this.#id}] Variable "${variable}" updated.`);
    const mutations = this.#mutations.get(variable);
    
    if (mutations && mutations.length) {
      mutations.forEach((mutation) => {
        mutation.perform();
      });
    }
    
    this.#scopes.forEach((scope) => {
      scope.update(variable);
    });
  }
}
