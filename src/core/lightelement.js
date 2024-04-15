import { LightElementShell } from "./lightelement-shell.js";
import { Scope } from "./scope.js";
import { AttributeDomMutation, ForDomMutation, IfDomMutation, NoopDomMutation, TextContentDomMutation } from "../dom-mutations/index.js";
import { ForStatement, LetStatement, ReturnStatement } from "../statements/index.js";

export class LightElement {
  static tagName = null;
  static css = null;
  static html = null;
  static #nextId = 1;
  static _registered = false;

  #id;
  #shell;
  #init;
  #dom;
  #attributesDependencies;
  #scope;

  constructor(shell) {
    this.#id = LightElement.#nextId++;
    this.#init = false;
    this.#shell = shell;
    this.#attributesDependencies = new Map(
      shell ?
      shell.constructor.observedClassMembers.map((attribute) => [attribute, []]) :
      []
    );

    // Avoid DOM parsing when the component has not been registered yet.
    // This is the initialization phase where we instantiate the class once to
    // list all of its class members.
    if (this.constructor._registered) {
      this.#scope = new Scope(this);
      this.#dom = this.#createDom();
    }
  }

  getId() {
    return this.#id;
  }

  getTagName() {
    return this.constructor.tagName;
  }

  getCssTemplate() {
    return this.constructor.css;
  }

  getHtmlTemplate() {
    return this.constructor.html;
  }

  getDom() {
    return this.#dom;
  }
  
  update(variable = null) {
    this.#scope.update(variable);
  }

  dispatchEvent(event) {
    this.#shell.dispatchEvent(event);
  }

  performInit() {
    if (this.#init) {
      return;
    }

    this.#init = true;
    this.update();
    this.onInit();
  }

  isInit() {
    return this.#init;
  }

  onInit() {}
  onDestroy() {}
  onChange(attributes) {}

  static processDomNode(scope, leInstance, node, keepStarUnprocessed = true) {
    const fingerprint = +Date.now();
    for(let i = 0; i<1000000; i++) {}

    console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] Processing node ${LightElement.nodeToString(node)} (stars: ${!keepStarUnprocessed})`);

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

        const statement = new ReturnStatement(match[1].trim(), leInstance, scope);
        const domMutation = new TextContentDomMutation(leInstance, variableNode, statement);
        const dependencies = statement.getDependencies();

        if (dependencies.length) {
          dependencies.forEach((variable) => {
            scope.addMutation(variable, domMutation);
          });
        }
        else {
          domMutation.perform();
        }
      }
    }
    else {
      let hasStarAttribute = false;
      const attributes = [];

      for (let j = 0; j < node.attributes.length; j++) {
        const attribute = node.attributes.item(j);
        const match = attribute.name.match(/^(?<type>[\*\(\[])(?<name>[\w-]+)[\)\]]?$/);

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
          keepStarUnprocessed = attributeDefintion.name == "for" || keepStarUnprocessed;
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
            console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] *${name} = ${attributeValue}`);

            if (name == "if") {
              statement = new ReturnStatement(attributeValue, leInstance, scope);
              domMutation = new IfDomMutation(leInstance, node, statement);
            }
            else if (name == "for") {
              statement = new ForStatement(attributeValue, leInstance, scope);
              domMutation = new ForDomMutation(leInstance, node, statement);
            }
            else if (name.startsWith("let-")) {
              const variable = name.substring(4);
              statement = new LetStatement(variable, attributeValue, leInstance, scope);
              domMutation = new NoopDomMutation(leInstance, node, statement);
            }

            break;
          }
          
          case "[": {
            statement = new ReturnStatement(attributeValue, leInstance, scope);
            domMutation = new AttributeDomMutation(
              leInstance,
              node,
              name,
              statement,
            );
            
            break;
          }
          
          case "(": {
            // TODO: Handle parameters, how in JS?
            node.addEventListener(name, scope.createStatement(attributeValue));
            
            break;
          }
        }
        
        node.removeAttribute(attributeName);
        
        if (statement && domMutation) {
          const dependencies = statement.getDependencies();

          if (dependencies.length) {
            dependencies.forEach((variable) => {
              scope.addMutation(variable, domMutation);
            });
          }
          else {
            domMutation.perform();
          }
        }
      });
    }

    console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] Fully process node ${LightElement.nodeToString(node)}? ${fullyProcessNode ? "yes" : "no"}`);

    if (fullyProcessNode) {
      for (let childNode of node.childNodes) {
        console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] Processing next children of ${LightElement.nodeToString(node)}...`);

        // Skip "for-generated" node as the scope won't be the correct one.
        if (childNode.nodeType == Node.ELEMENT_NODE && childNode.hasAttribute("for-generated")) {
          console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] Skipping for-generated node...`);
          continue;
        }

        LightElement.processDomNode(scope, leInstance, childNode, keepStarUnprocessed);
      }

      console.log(`${fingerprint} - [${leInstance.getTagName()}#${leInstance.getId()}][Scope#${scope.getId()}] ${LightElement.nodeToString(node)} children processed.`);
    }
  }
  
  #createDom() {
    const dom = new DOMParser().parseFromString(
      `<html><head></head><body><style type="text/css">html,body{padding:0;margin:0;}${this.constructor.css}</style>${this.constructor.html}</body></html>`,
      "text/html"
    );
    const body = dom.documentElement.querySelector("body");
    
    LightElement.processDomNode(this.#scope, this, body);
    
    return body;
  }

  static register() {
    console.log(`Registering "${this.tagName}"...`);
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

              // Trigger the scope variable update
              oThis.update(`this.${attribute}`);
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
    this._registered = true;
    console.log(`LightElement "${this.tagName}" registered.`);
  }

  static async load(url) {
    return import(/* webpackIgnore: true */ url);
  }

  static nodeToString(node) {
    if (node.nodeType == Node.TEXT_NODE) {
      return `\`${node.textContent}\``;
    }
    else if (node.nodeType == Node.ELEMENT_NODE) {
      let parts = [node.nodeName.toLowerCase()];

      for (const attribute of node.attributes) {
        parts.push(`${attribute.name}="${attribute.value}"`);
      }

      return `<${parts.join(" ")}>`;
    }
    else if (node.nodeType == Node.COMMENT_NODE) {
      return `<!-- ${node.textContent} -->`;
    }

    console.log(node, node.nodeType, node.nodeName);
    return `${node}`;
  }
}
