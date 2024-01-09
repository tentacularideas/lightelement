const expectedValue = "Hello";

class Test006 extends LightElement {
  static tagName = "test-006";
  static css = ``;
  static html = `
    <p *let-variable="'Hello'">{{ variable }}</p>
  `;
}

Test006.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test006.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test006.tagName);
  const dom = node.dom;
  const p = dom.querySelector("p");

  return p.innerHTML == expectedValue;
}

export {
  setup,
  expect,
};