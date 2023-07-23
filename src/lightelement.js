class LightElementShell extends HTMLElement {
  static NonPrimitiveFlag = "[le-non-primitive]";
  static _elementClass = null;
  static _attributesMapping = null;

  _element;

  constructor() {
    super();
    this._element = new this.constructor._elementClass(this);

    this.attachShadow({ mode: "open" }).innerHTML = `
        <style type="text/css">
        ${this._element.getCss()}
        </style>
        `;

    this.shadowRoot.append(this._element.getDom());
  }

  /*
   * Automatically generated.
   * static get observedAttributes() {}
   * static get observedClassMembers() {}
   */

  connectedCallback() {
    this._element.update();
  }

  disconnectedCallback() {}
  adoptedCallback() {}

  attributeChangedCallback(attribute, _, value) {
    if (value == LightElementShell.NonPrimitiveFlag) {
      return;
    }

    const internalAttribute = this.constructor._attributesMapping.get(attribute);
    this._element[internalAttribute] = value;
  }
}

class Statement {
  _target;
  _statement;

  constructor(statement, target = null) {
    this._target = target;
    this._statement = statement;
  }

  resolve() {}
}

class ReturnStatement extends Statement {
  #fn;

  constructor(statement, target = null) {
    super(statement, target);

    // TODO: handle more complex cases
    this.#fn = (new Function(`return (${this._statement || null});`)).bind(this._target);
  }

  getDependencies() {
    // Extract dependencies from statement by running it with a Proxy.
    // WARNING: It only works with simple straightforward statements. 
    const dependencies = [];

    (new Function(this._statement)).bind(new Proxy(this._target, {
      get(target, property) {
        dependencies.push(property);
        return target[property];
      },
    }))();

    return dependencies;
  }

  resolve() {
    return this.#fn();
  }
}

class ForStatement extends Statement {
  #fn;
  #variable;
  #iterable;

  constructor(statement, target = null) {
    super(statement, target);

    const parsedStatement = this.constructor.#parseStatement(statement);
    this.#variable = parsedStatement.variable;
    this.#iterable = parsedStatement.iterable;

    const GeneratorFunction = function*() {}.constructor;
    this.#fn = (new GeneratorFunction(`for (let item of ${this.#iterable} || []) { yield item; }`)).bind(this._target);
  }

  static #parseStatement(statement) {
    return {
      variable: "item",
      iterable: "this.elements",
    };
  }

  getVariableName() {
    return this.#variable;
  }

  getDependencies() {
    return ["elements"];
  }

  *resolve() {
    for (let item of this.#fn()) {
      yield item;
    }
  }
}

class DomMutation {
  _lightElement;
  _node;

  constructor(lightElement, node) {
    this._lightElement = lightElement;
    this._node = node;
  }

  perform() {}
}

class AttributeDomMutation extends DomMutation {
  _attribute;
  _statement;

  constructor(lightElement, node, attribute, statement) {
    super(lightElement, node);
    this._attribute = attribute;
    this._statement = statement;
  }

  perform() {
    const value = this._statement.resolve();

    if (value === true) {
      this._node.setAttribute(this._attribute, "");
    }
    else if (value === false) {
      this._node.removeAttribute(this._attribute);
    }
    else {
      this._node.setAttribute(this._attribute, value);
    }
  }
}

class TextContentDomMutation extends DomMutation {
  _statement;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
  }

  perform() {
    this._node.textContent = `${this._statement.resolve()}`;
  }
}

class IfDomMutation extends DomMutation {
  _statement;
  _hook;
  _template;
  _scope;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._template = node;
    this._node = null;
    this._scope = new Scope(lightElement);
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
      LightElement.processDomNode(this._scope, this._lightElement, this._node, false);
      this._hook.after(this._node);
    }

    else if (!value && this._node) {
      this._node.remove();
      this._node = null;
    }
  }
}

class ForDomMutation extends DomMutation {
  _statement;
  _hook;
  _tags;
  _scope;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._hook = null;
    this._tags = [];
    this._scope = new Scope(lightElement);
  }

  perform() {
    if (!this._hook) {
      this._hook = document.createComment("*for");
      this._node.replaceWith(this._hook);
    }

    this._tags.forEach((tag) => {
      tag.remove();
    });

    for (let item of this._statement.resolve()) {
      const tag = this._node.cloneNode(true);
      const scope = this._scope.createVariation("item", item);
      
      LightElement.processDomNode(scope, this._lightElement, tag, false);

      this._tags.push(tag);
      this._hook.after(tag);
    }
  }
}

class Scope {
  #scopes;
  #parentScope;
  #mutations;
  #instance;
  #variables;
  
  constructor(instance) {
    this.#scopes = new Set();
    this.#parentScope = null;
    this.#mutations = new Map();
    this.#instance = instance;
    this.#variables = new Map();
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
  }
  
  addMutations(variable, mutations) {
    if (this.#mutations.has(variable)) {
      this.#mutations.get(variable).push(...mutations);
    }
    else {
      this.#mutations.set(variable, mutations);
    }
  }
  
  setVariable(name, value) {
    this.#variables.set(name, value);
  }
  
  getVariables() {
    return Object.fromEntries(this.#variables.entries());
  }
  
  createStatement(body) {
    return (new Function(body)).bind(this.#instance);
  }
  
  createVariation(variable, value) {
    const variation = new Scope(this.#instance);
    variation.setVariable(name, value);
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

class LightElement {
  static tagName = null;
  static css = null;
  static html = null;

  #dom;
  #attributesDependencies;
  #scope;

  constructor(shell) {
    this.#attributesDependencies = new Map(
      shell ?
      shell.constructor.observedClassMembers.map((attribute) => [attribute, []]) :
      []
    );

    this.#scope = new Scope(this);
    this.#dom = this.#createDom();
  }

  getCss() {
    return this.constructor.css;
  }

  getHtmlTemplate() {
    return this.constructor.html;
  }

  getDom() {
    return this.#dom;
  }
  
  update(attribute = null) {
    this.#scope.update(attribute);
  }

  /*propagateChanges(attribute = null) {
    if (attribute == null) {
      for (let attribute of this.#attributesDependencies.keys()) {
        this.propagateChanges(attribute);
      }

      return;
    }

    if (!this.#attributesDependencies.has(attribute)) {
      return;
    }

    this.#attributesDependencies.get(attribute).forEach((domMutation) => {
      domMutation.perform();
    });
  }*/

  static processDomNode(scope, leInstance, node, keepStarUnprocessed = true) {
    if (![Node.TEXT_NODE, Node.ELEMENT_NODE].includes(node.nodeType)) {
      return null;
    }

    let fullyProcessNode = true;

    if (node.nodeType == Node.TEXT_NODE) {
      const re = /\{\{(?<statement>[^\}]*)\}\}/;
      const match = re.exec(node.textContent);

      if (match) {
        const index = node.textContent.indexOf(match[0]);
        const variableNode = (index > 0) ? node.splitText(index) : node;

        if (variableNode.length > match[0].length) {
          variableNode.splitText(match[0].length);
        }

        const statement = new ReturnStatement(match[1].trim(), leInstance);
        const domMutation = new TextContentDomMutation(leInstance, variableNode, statement);
        statement.getDependencies().forEach((attribute) => {
          scope.addMutation(attribute, domMutation);
        });
      }
    }
    else {
      let hasStarAttribute = false;
      const attributes = [];

      for (let j = 0; j < node.attributes.length; j++) {
        const attribute = node.attributes.item(j);
        const match = attribute.name.match(/^(?<type>[\*\(\[])(?<name>\w+)[\)\]]?$/);

        if (!match) {
          continue;
        }

        const attributeDefintion = {
          attributeName: attribute.name,
          type: match.groups.type,
          name: match.groups.name,
          attributeValue: attribute.value,
        };

        if (attributeDefintion.type == "*") {
          if (hasStarAttribute) {
            throw new Error(`Element "${node.tagName}" has more than one *attribute. Only zero to one are allowed.`);
          }

          hasStarAttribute = true;
          attributes.unshift(attributeDefintion);
        }
        else {
          attributes.push(attributeDefintion);
        }
      }
      
      fullyProcessNode = !(hasStarAttribute && keepStarUnprocessed);

      attributes.forEach(({ attributeName, type, name, attributeValue }) => {
        if (!fullyProcessNode && type != "*") {
          return;
        }
        
        let statement = null;
        let domMutation = null;
        
        switch (type) {
          case "*": {
            if (name == "if") {
              statement = new ReturnStatement(attributeValue, leInstance);
              domMutation = new IfDomMutation(leInstance, node, statement);
            }
            else if (name == "for") {
              statement = new ForStatement(attributeValue, leInstance);
              domMutation = new ForDomMutation(leInstance, node, statement);
            }
            
            break;
          }
          
          case "[": {
            statement = new ReturnStatement(attributeValue, leInstance);
            domMutation = new AttributeDomMutation(
              leInstance,
              node,
              name,
              statement,
            );
            
            break;
          }
          
          case "(": {
            node.addEventListener(name, new Function("event", attributeValue).bind(leInstance));
            
            break;
          }
        }
        
        node.removeAttribute(attributeName);
        
        if (statement && domMutation) {
          statement.getDependencies().forEach((variable) => {
            scope.addMutation(variable, domMutation);
          });
        }
      });
    }

    if (fullyProcessNode) {
      for (let childNode of node.childNodes) {
        LightElement.processDomNode(scope, leInstance, childNode, keepStarUnprocessed);
      }
    }
  }
  
  #createDom() {
    const dom = new DOMParser().parseFromString(this.constructor.html, "text/html");
    const body = dom.documentElement.querySelector("body");
    
    LightElement.processDomNode(this.#scope, this, body);

    return body;
  }

  static register() {
    const allVariables = Reflect.ownKeys(new this());
    const publicAttributes = allVariables.filter((key) => !key.match(/^[#_]/));
    const attributesMapping = publicAttributes.map((attribute) => {
      const internalAttribute = attribute;
      return [attribute.toLowerCase(), internalAttribute];
    });
    const attributes = publicAttributes.map((attribute) => {
      return attribute.toLowerCase();
    });

    const currentClass = class extends this {
      constructor(shell) {
        super(shell);

        // TODO: This is only for simple values, not arrays and objects
        for (let attribute of shell.constructor.observedClassMembers) {
          const oThis = this;
          let oValue = oThis[attribute];

          Object.defineProperty(oThis, attribute, {
            get() {
              return oValue;
            },
            set(value) {
              oValue = value;
              oThis.update(attribute);
            },
            enumerable: true,
            configurable: true,
          });
        }
      }
    };

    const class_ = class extends LightElementShell {
      static _elementClass = currentClass;
      static _attributesMapping = new Map(attributesMapping);

      static get observedClassMembers() {
        return allVariables;
      }

      static get observedAttributes() {
        return attributes;
      }

      setAttribute(attribute, value) {
        if (typeof value == "object" && value !== null) {
          super.setAttribute(attribute, LightElementShell.NonPrimitiveFlag);
          this.attributeChangedCallback(attribute, null, value);
        }
        else {
          super.setAttribute(attribute, value);
        }
      }
    }

    window.customElements.define(this.tagName, class_);
  }
}