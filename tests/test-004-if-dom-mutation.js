class Test004 extends LightElement {
  static tagName = "test-004";
  static css = ``;
  static html = `
    <p *if="!this.enabled" class="failure">Simple *if failure</p>
    <p *if="this.enabled" class="success">Simple *if success</p>
    <div *if="this.enabled" class="success">
      <p *if="!this.enabled" class="failure">Encapsulated-1 *if failure</p>
      <p *if="this.enabled" class="success">Encapsulated-1 *if success</p>
    </div>
    <div *if="!this.enabled" class="failure">
      <p *if="!this.enabled" class="failure">Encapsulated-2 *if failure</p>
      <p *if="this.enabled" class="failure">Encapsulated-2 *if failure</p>
    </div>
    `;

  enabled = true;
}

Test004.register();

function setup(rootNode) {
  const node = document.createElement(Test004.tagName);
  rootNode.append(node);
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test004.tagName);
  const dom = node.dom;
  const element = dom.querySelector(".failure");
  return !element;
}

export {
  setup,
  expect,
};