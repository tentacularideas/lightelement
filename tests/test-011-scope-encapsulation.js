const expectedElements = [{"name": "One"}, {"name": "Two"}, {"name": "Three"}];

class Test011 extends LightElement {
  static tagName = "test-011";
  static css = ``;
  static html = `
  <ul *if="!!this.elements?.length">
    <li *for="let element of this.elements">{{ element.name }}</li>
  </ul>
  `;

  elements = expectedElements;
}

Test011.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test011.tagName} />`;
}
  
async function expect(rootNode) {
  const node = rootNode.querySelector(Test011.tagName);
  const lis = Array.from(node.dom.querySelectorAll("li"));

  return lis.map((li) => li.innerText.trim()).join("") == expectedElements.map((element) => element.name).join("");
}
  
export {
  setup,
  expect,
};