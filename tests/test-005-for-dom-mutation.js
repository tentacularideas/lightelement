const expectedValue = ["one", "two", "three"];
const expectedValueAsync = ["two", "three", "four"];
class Test005 extends LightElement {
  static tagName = "test-005";
  static css = ``;
  static html = `
    <ul class="not-empty">
      <li *for="let notEmpty of this.elements">{{ notEmpty }}</li>
    </ul>
    
    <ul class="empty">
      <li *for="let empty of this.noElements">{{ empty }}</li>
    </ul>
    `;

  noElements = [];
  elements = expectedValue;

  asyncUpdate() {
    this.elements = expectedValueAsync;
  }
}

Test005.register();

function setup(rootNode) {
  const node = document.createElement(Test005.tagName);
  rootNode.append(node);
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test005.tagName);
  const dom = node.dom;
  const element0 = dom.querySelector("ul.not-empty li");
  const element1 = dom.querySelector("ul.empty li");
  
  const notEmptyLi = Array.from(dom.querySelectorAll("ul.not-empty li"));
  const correctLiValues = notEmptyLi.map((node) => node.innerHTML).join("") == expectedValue.join("");

  const test1 = !element1 && !!element0 && correctLiValues;

  node.element.asyncUpdate();
  const notEmptyLiAsync = Array.from(dom.querySelectorAll("ul.not-empty li"));
  const test2 = notEmptyLiAsync.map((node) => node.innerHTML).join("") == expectedValueAsync.join("");

  return test1 && test2;
}

export {
  setup,
  expect,
};