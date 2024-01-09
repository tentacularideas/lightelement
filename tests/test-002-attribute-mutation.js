const expectedValue = "Hello";

class Test002 extends LightElement {
  static tagName = "test-002";
  static css = ``;
  static html = `
    <input type="text" [value]="this.text">
    `;

  text = expectedValue;
}

Test002.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test002.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test002.tagName);
  const dom = node.dom;
  const input = dom.querySelector("input");
  const value = input.getAttribute("value");

  return value == expectedValue;
}

export {
  setup,
  expect,
};