const expectedValue = "Hello";
const expectedValueAsync = "Hello again";
const expectedValueObject = {"content": "Hello object"};

class Test008 extends LightElement {
  static tagName = "test-008";
  static css = ``;
  static html = `
    <p>{{ this.text?.content || this.text }}</p>
  `;
    
  text;

  constructor(shell) {
    super(shell);
    this.text ||= null;
  }
}

Test008.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test008.tagName} text="${expectedValue}" />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test008.tagName);
  const p = node.dom.querySelector("p");

  let innerHTML = p.innerHTML.trim();
  const test1 = innerHTML == expectedValue;

  node.setAttribute("text", expectedValueAsync);
  innerHTML = p.innerHTML.trim();
  const test2 = innerHTML == expectedValueAsync;

  node.setAttribute("text", expectedValueObject);
  innerHTML = p.innerHTML.trim();
  const test3 = innerHTML == expectedValueObject.content;

  return test1 && test2 && test3;
}

export {
  setup,
  expect,
};