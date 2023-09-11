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
  elements = ["one", "two", "three"];
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
  
  return !element1 && !!element0;
}

export {
  setup,
  expect,
};