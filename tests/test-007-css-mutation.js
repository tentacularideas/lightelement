const expectedValue = "rgb(0, 0, 0)";
const expectedValueAsync = "rgb(255, 0, 0)";

class Test007 extends LightElement {
  static tagName = "test-007";
  static css = `p {
    color: {{ this.textColor }};
  }`;
  static html = `
    <p>Hello, this is my text.</p>
  `;

  textColor = expectedValue;

  asyncUpdate() {
    this.textColor = expectedValueAsync;
  }
}

Test007.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test007.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test007.tagName);
  const dom = node.dom;
  const p = dom.querySelector("p");

  const test0 = window.getComputedStyle(p).color == expectedValue;
  node.element.asyncUpdate();
  const test1 = window.getComputedStyle(p).color == expectedValueAsync;

  return test0 && test1;
}

export {
  setup,
  expect,
};