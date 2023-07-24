const expectedValue = "Hello";

class Test001 extends LightElement {
  static tagName = "test-001";
  static css = ``;
  static html = `
    {{ this.text }}
    `;
    
  text = expectedValue;
}

Test001.register();

function setup(rootNode) {
  const node = document.createElement(Test001.tagName);
  rootNode.append(node);
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test001.tagName);
  const innerHTML = node.innerHTML.trim();
  
  return innerHTML == expectedValue;
}

export {
  setup,
  expect,
};