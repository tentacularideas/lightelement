import { DomMutation } from "./dom-mutation.js";

export class ForDomMutation extends DomMutation {
  _statement;
  _template;
  _tags;

  constructor(lightElement, node, statement) {
    super(lightElement, node);
    this._statement = statement;
    this._template = node;
    this._node = document.createComment("*for");
    this._template.replaceWith(this._node);
    this._tags = [];
  }

  perform() {
    this._tags.forEach((tag) => {
      tag.remove();
    });

    this._tags.length = 0;
    let lastTag = this._node;

    for (let item of this._statement.resolve()) {
      const tag = this._template.cloneNode(true);

      const scope = this._statement.getScope().createVariation(this._statement.getVariableName(), item);
      console.log(`[${this._lightElement.getTagName()}#${this._lightElement.getId()}][Scope#${scope.getId()}] Variation of Scope#${this._statement.getScope().getId()}.`);
      LightElement.processDomNode(scope, this._lightElement, tag, false);
      tag.setAttribute("for-generated", "");
      lastTag.after(tag);
      lastTag = tag;
      
      this._tags.push(tag);
    }
  }
}
