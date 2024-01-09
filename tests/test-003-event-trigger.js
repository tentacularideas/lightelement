class Test003 extends LightElement {
  static tagName = "test-003";
  static css = ``;
  static html = `
    <button (click)="this.action()">{{ this.count }}</button>
    `;

  count = 0;

  action() {
    this.count++;
  }
  
  getCount() {
    return this.count;
  }
}

Test003.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test003.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test003.tagName);
  const dom = node.dom;
  const button = dom.querySelector("button");
  
  const initialValue = node.element.getCount();
  button.click();
  const newValue = node.element.getCount();

  return newValue == initialValue + 1;
}

export {
  setup,
  expect,
};