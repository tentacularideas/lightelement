class Tag extends LightElement {
  static tagName = "fin-tag";
  static css = ``;
  static html = `
    <input type="text" (change)="this.save()" [value]="this.label" placeholder="Catégorie"/>
    <button (click)="this.remove()" [disabled]="!this.tagId" >&#215;</button>
    <button *if="!!this.tagId" (click)="this.hello();">Not new: {{ this.label }} {{ this._counter }}</button>
    <ul *if="this.elements">
        <li *for="let item of this.elements"> item </li>
    </ul>
  `;

  tagId;
  label;
  elements;
  _counter;

  constructor(shell) {
    super(shell);
    this._counter = 0;
  }

  hello() {
    console.log("hello!");
    this._counter++;
  }

  remove() {
    this.tagId = null;
  }

  save() {
    this.tagId = 1234;
  }
}

Tag.register();

const tag0 = document.createElement("fin-tag");
tag0.setAttribute("label", "Hello");
tag0.setAttribute("tagId", 1234);
tag0.setAttribute("elements", ["one", "two", "three"]);

const tag1 = document.createElement("fin-tag");
tag1.setAttribute("label", "Hello bis");
document.body.prepend(tag1);
document.body.prepend(tag0);