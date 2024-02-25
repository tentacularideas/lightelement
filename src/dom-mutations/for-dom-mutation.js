import { DomMutation } from "./dom-mutation.js";

export class ForDomMutation extends DomMutation {
  _statement;
  _hook;
  _tags;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._hook = null;
    this._tags = [];
  }

  perform() {
    if (!this._hook) {
      this._hook = document.createComment("*for");
      this._node.replaceWith(this._hook);
    }

    this._tags.forEach((tag) => {
      tag.remove();
    });

    this._tags = [];

    for (let item of this._statement.resolve()) {
      const tag = this._node.cloneNode(true);

      const scope = this._statement.getScope().createVariation(this._statement.getVariableName(), item);
      console.log(`[${this._lightElement.getTagName()}#${this._lightElement.getId()}][Scope#${scope.getId()}] Variation of Scope#${this._statement.getScope().getId()}.`);
      LightElement.processDomNode(scope, this._lightElement, tag, false);
      tag.setAttribute("for-generated", "");

      if (this._tags.length) {
        this._tags[this._tags.length - 1].after(tag);
      }
      else {
        this._hook.after(tag);
      }
      
      this._tags.push(tag);
    }
  }
}
