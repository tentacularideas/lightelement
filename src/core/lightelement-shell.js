export class LightElementShell extends HTMLElement {
  static NonPrimitiveFlag = "[le-non-primitive]";
  static _elementClass = null;
  static _attributesMapping = null;

  _element;

  constructor() {
    super();
    this._element = new this.constructor._elementClass(this);
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
