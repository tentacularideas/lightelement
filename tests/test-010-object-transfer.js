const expectedElements = [{"id": 1, "label": "One"},{"id": 2, "label": "Two"},{"id": 3, "label": "Three"}];

class MyComponent extends LightElement {
  static tagName = "my-component";
  static css = ``;
  static html = `
  <p>
    <label for="id">ID:</label>
    <input id="id" type="text" [value]="this.element?.id" />
  </p>
  <p>
    <label for="label">Label:</label>
    <input id="label" type="text" [value]="this.element?.label" />
  </p>
  `;

  element;

  constructor(shell) {
    super(shell);
    this.element ||= null;
  }

  getLabel() {
    return this.getDom().querySelector("input#label").getAttribute("value");
  }
}

class Test010 extends LightElement {
  static tagName = "test-010";
  static css = ``;
  static html = `
    <my-component *for="let element of this.elements" [element]="element" />
  `;

  elements = expectedElements;

  getLabels() {
    return Array.from(this.getDom().querySelectorAll("my-component")).map((node) => {
      return node.element.getLabel();
    });
  }
}
  
MyComponent.register();
Test010.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test010.tagName} />`;
}
  
async function expect(rootNode) {
  const node = rootNode.querySelector(Test010.tagName);

  // Wait 100ms to ensure all custom element have been loaded
  await new Promise(resolve => setTimeout(resolve, 100));

  return node.element.getLabels().join("") == expectedElements.map((element) => element.label).join("");
}
  
export {
  setup,
  expect,
};