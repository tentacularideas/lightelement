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
    this._element.propagateChanges();
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

  * resolve() {
    for (let item of this.#fn()) {
      yield item;
    }
  }
}

class DomMutation {
  _tag;

  constructor(tag) {
    this._tag = tag;
  }

  perform() {}
}

class AttributeDomMutation extends DomMutation {
  _attribute;
  _statement;

  constructor(tag, attribute, statement) {
    super(tag);
    this._attribute = attribute;
    this._statement = statement;
  }

  perform() {
    const value = this._statement.resolve();

    if (value === true) {
      this._tag.setAttribute(this._attribute, "");
    }
    else if (value === false) {
      this._tag.removeAttribute(this._attribute);
    }
    else {
      this._tag.setAttribute(this._attribute, value);
    }
  }
}

class TextContentDomMutation extends DomMutation {
  _statement;

  constructor(node, statement) {
    super(node);
    this._statement = statement;
  }

  perform() {
    this._tag.textContent = `${this._statement.resolve()}`;
  }
}

class IfDomMutation extends DomMutation {
  _statement;
  _hook;

  constructor(tag, statement) {
    super(tag);
    this._statement = statement;
  }

  perform() {
    // TODO: First call, to be optimized
    if (!this._hook) {
      this._hook = document.createComment("*if");
      this._tag.replaceWith(this._hook);
    }

    const value = this._statement.resolve();

    if (!this._tag.isConnected && value) {
      this._hook.after(this._tag);
    }
    else if (this._tag.isConnected && !value) {
      this._tag.remove();
    }
  }
}

class ForDomMutation extends DomMutation {
  _statement;
  _hook;
  _tags;

  constructor(tag, statement) {
    super(tag);
    this._statement = statement;
    this._hook = null;
    this._tags = [];
  }

  perform() {
    if (!this._hook) {
      this._hook = document.createComment("*for");
      this._tag.replaceWith(this._hook);
    }

    this._tags.forEach((tag) => {
      tag.remove();
    });

    for (let item of this._statement.resolve()) {
      const tag = this._tag.cloneNode(true);

      // TODO: process tag

      this._tags.push(tag);
      this._hook.after(tag);
    }
  }
}

class LightElement {
  static tagName = null;
  static css = null;
  static html = null;

  #dom;
  #attributesDependencies;

  constructor(shell) {
    this.#attributesDependencies = new Map(
      shell ?
      shell.constructor.observedClassMembers.map((attribute) => [attribute, []]) :
      []
    );

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

  propagateChanges(attribute = null) {
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
  }

  static processDomNode(node, keepStarUnprocessed = true) {
    if (![Node.TEXT_NODE, Node.ELEMENT_NODE].includes(node.nodeType)) {
      return null;
    }

    const mutations = new Map();

    if (node.nodeType == Node.TEXT_NODE) {
      const re = /\{\{(?<statement>[^\}]*)\}\}/;
      const match = re.exec(node.textContent);

      if (match) {
        const index = node.textContent.indexOf(match[0]);
        const variableNode = (index > 0) ? node.splitText(index) : node;

        if (variableNode.length > match[0].length) {
          variableNode.splitText(match[0].length);
        }

        const statement = new ReturnStatement(match[1].trim(), this);
        const domMutation = new TextContentDomMutation(variableNode, statement);
        statement.getDependencies().forEach((attribute) => {
          if (mutations.has(attribute)) {
            mutations.get(attribute).push(domMutation);
          }
          else {
            mutations.set(attribute, [domMutation]);
          }
        });
      }
    }
    else {
      let hasStarAttribute = false;
      const attributes = [];

      for (let j = 0; j < tag.attributes.length; j++) {
        const attribute = tag.attributes.item(j);
        const match = attribute.name.match(/^(?<type>[\*\(\[])(?<name>\w+)[\)\]]?$/);

        if (!match) {
          continue;
        }

        const attributeDefintion = {
          type: match.groups.type,
          name: match.groups.name,
        };

        if (match.groups.type == "*") {
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

      attributes.forEach(({ type, name }) => {
        console.log(type, name);
      });
    }

    if (!keepStarUnprocessed) {
      for (let node of tag.childNodes) {
        const childMutations = LightElement.processDomNode(node, keepStarUnprocessed);

        if (!childMutations) {
          continue;
        }

        childMutations.forEach((domMutation, attribute) => {
          if (mutations.has(attribute)) {
            mutations.get(attribute).push(domMutation);
          }
          else {
            mutations.set(attribute, [domMutation]);
          }
        });
      }
    }

    return mutations;
  }

  #processDomTag(tag) {
    const attributesToRemove = [];

    for (let j = 0; j < tag.attributes.length; j++) {
      const attribute = tag.attributes.item(j);
      const match = attribute.name.match(/^(?<type>[\*\(\[])(?<name>\w+)[\)\]]?$/);

      if (!match) {
        continue;
      }

      let statement = null;
      let domMutation = null;

      if (match.groups.type == "*") {
        attributesToRemove.push(attribute.name);

        switch (match.groups.name) {
          case "if": {
            statement = new ReturnStatement(attribute.value, this);
            domMutation = new IfDomMutation(tag, statement);
            break;
          }

          case "for": {
            statement = new ForStatement(attribute.value, this);
            domMutation = new ForDomMutation(tag, statement);
            break;
          }
        }
      }
      else if (match.groups.type == "(") {
        attributesToRemove.push(attribute.name);
        tag.addEventListener(match.groups.name, new Function("event", attribute.value).bind(this));
      }
      else if (match.groups.type == "[") {
        statement = new ReturnStatement(attribute.value, this);
        domMutation = new AttributeDomMutation(
          tag,
          match.groups.name,
          statement,
        );
      }

      if (statement && domMutation) {
        statement.getDependencies().forEach((attribute) => {
          if (!this.#attributesDependencies.has(attribute)) {
            return;
          }

          this.#attributesDependencies.get(attribute).push(domMutation);
        });
      }
    }

    attributesToRemove.forEach((attribute) => {
      tag.removeAttribute(attribute);
    });

    // Content
    for (let node of tag.childNodes) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        this.#processDomTag(node);
      }

      if (node.nodeType != Node.TEXT_NODE) {
        continue;
      }

      const re = /\{\{(?<statement>[^\}]*)\}\}/;
      const match = re.exec(node.textContent);

      if (match) {
        const index = node.textContent.indexOf(match[0]);
        const variableNode = (index > 0) ? node.splitText(index) : node;

        if (variableNode.length > match[0].length) {
          variableNode.splitText(match[0].length);
        }

        const statement = new ReturnStatement(match[1].trim(), this);
        const domMutation = new TextContentDomMutation(variableNode, statement);
        statement.getDependencies().forEach((attribute) => {
          if (!this.#attributesDependencies.has(attribute)) {
            return;
          }

          this.#attributesDependencies.get(attribute).push(domMutation);
        });
      }
    }
  }

  #createDom() {
    const dom = new DOMParser().parseFromString(this.constructor.html, "text/html");
    const body = dom.documentElement.querySelector("body");

    for (let i = 0; i < body.children.length; i++) {
      const tag = body.children.item(i);
      this.#processDomTag(tag);
    }

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
              oThis.propagateChanges(attribute);
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