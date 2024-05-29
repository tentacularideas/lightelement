class Component extends LightElement {
  static tagName = "my-deep-component";
  static css = ``;
  static html = `{{ this.value || "nothing" }} <slot></slot>`;

  value;
}

Component.register();

class Test014 extends LightElement {
  static tagName = "test-014";
  static css = ``;
  static html = `
  <div *if="this.items?.length">
    <div *for="let item of this.items">
      <div *if="item.odd">
        <my-deep-component [value]="item.v"></my-deep-component>
      </div>
    </div>
  </div>
  `;

  items = [
    {v: 1, odd: true},
    {v: 2, odd: false},
    {v: 3, odd: true},
    {v: 4, odd: false},
    {v: 5, odd: true}
  ];

  constructor(shell) {
    super(shell);
  }
}

Test014.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test014.tagName} />`;
}
  
async function expect(rootNode) {
  const node = rootNode.querySelector(Test014.tagName);

  const visibleItems = Array.from(node.dom.querySelectorAll("my-deep-component")).map(tag => tag.dom.innerText?.trim());
  return JSON.stringify(visibleItems) == JSON.stringify(["1","3","5"]);
}
  
export {
  setup,
  expect,
};