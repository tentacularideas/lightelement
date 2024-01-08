const expectedValue = "Hello";
const expectedValueAsync = "Hello again!";

class Test001 extends LightElement {
  static tagName = "test-001";
  static css = ``;
  static html = `
    <p>{{ this.text }}</p>
    `;
    
  text = expectedValue;

  asyncUpdate() {
    this.text = expectedValueAsync;
  }
}

Test001.register();

function setup(rootNode) {
  const node = document.createElement(Test001.tagName);
  rootNode.append(node);
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test001.tagName);
  const p = node.dom.querySelector("p");
  let innerHTML = p.innerHTML.trim();
  
  const test1 = innerHTML == expectedValue;

  if (!test1) {
    return test1;
  }

  node.element.asyncUpdate();
  innerHTML = p.innerHTML.trim();

  const test2 = innerHTML == expectedValueAsync;

  return test1 && test2;
}

export {
  setup,
  expect,
};