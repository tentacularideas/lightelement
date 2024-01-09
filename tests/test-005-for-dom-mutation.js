const expectedValue = ["one", "two", "three"];
const expectedValueAsync = ["two", "three", "four"];
const expectedObjects = [{"id": "first"},{"id": "second"},{"id": "third"}];
class Test005 extends LightElement {
  static tagName = "test-005";
  static css = ``;
  static html = `
    <ul class="not-empty">
      <li *for="let notEmpty of this.elements">{{ notEmpty }}<input type="text" [value]="notEmpty" /></li>
    </ul>
    
    <ul class="empty">
      <li *for="let empty of this.noElements">{{ empty }}</li>
    </ul>

    <ul class="objects">
      <li *for="let obj of this.objects">{{ obj.id }}</li>
    </ul>
    `;

  noElements = [];
  elements = expectedValue;
  objects = expectedObjects;

  asyncUpdate() {
    this.elements = expectedValueAsync;
  }
}

Test005.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test005.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test005.tagName);
  const dom = node.dom;
  const element0 = dom.querySelector("ul.not-empty li");
  const element1 = dom.querySelector("ul.empty li");
  
  const notEmptyLi = Array.from(dom.querySelectorAll("ul.not-empty li"));
  const correctLiValues = notEmptyLi.map((node) => node.innerText).join("") == expectedValue.join("");

  const test1 = !element1 && !!element0 && correctLiValues;

  const liInputText = Array.from(dom.querySelectorAll("ul.not-empty li input[type=text]"));
  const test2 = liInputText.map((node) => node.value).join("") == expectedValue.join("");

  node.element.asyncUpdate();
  const notEmptyLiAsync = Array.from(dom.querySelectorAll("ul.not-empty li"));
  const test3 = notEmptyLiAsync.map((node) => node.innerText).join("") == expectedValueAsync.join("");

  const objects = Array.from(dom.querySelectorAll("ul.objects li"));
  const test4 = objects.map((node) => node.innerText).join("") == expectedObjects.map((obj) => obj.id).join("");

  return test1 && test2 && test3 && test4;
}

export {
  setup,
  expect,
};