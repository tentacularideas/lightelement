export class LightElementShell extends HTMLElement {
  static NonPrimitiveFlag = "[le-non-primitive]";
  static _elementClass = null;
  static _attributesMapping = null;
  static _publicMethods = null;

  _element;

  constructor() {
    super();
    this._element = new this.constructor._elementClass(this);
    this.#registerPublicMethods();
    this.attachShadow({ mode: "open" }).append(this._element.getDom());
  }
  
  get element() {
    return this._element;
  }
  
  get dom() {
    return this.shadowRoot.querySelector("body");
  }
  
  get innerHTML() {
    return this.dom.innerHTML;
  }

  /*
   * Automatically generated.
   * static get observedAttributes() {}
   * static get observedClassMembers() {}
   */

  connectedCallback() {
    if (this._leDelayedDomMutations) {
      while (this._leDelayedDomMutations.length) {
        this._leDelayedDomMutations.shift().perform();
      }
    }

    this._element.performInit();
  }

  disconnectedCallback() {}
  adoptedCallback() {}

  attributeChangedCallback(attribute, _, value) {
    const internalAttribute = this.constructor._attributesMapping.get(attribute);

    if (value != LightElementShell.NonPrimitiveFlag) {
      this._element[internalAttribute] = value;
    }
    
    if (this._element.isInit()) {
      this._element.performChange(internalAttribute);
    }
  }

  #registerPublicMethods() {
    for (let publicMethod of this.constructor._publicMethods || []) {
      this[publicMethod] = this._element[publicMethod].bind(this._element);
    }
  }
}
