class Test012 extends LightElement {
  static tagName = "test-012";
  static css = ``;
  static html = `<span *if="this._count > 0">
    {{ this._count }}
  </span>`;

  value;
  _count;

  constructor(shell) {
    super(shell);
    this.value ||= null;
    this._count = 0;
  }

  onChange(attributes) {
    this._count++;
  }
}

Test012.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test012.tagName} value="Hello" />`;
}
  
async function expect(rootNode) {
  const node = rootNode.querySelector(Test012.tagName);
  node.setAttribute("value", "Bye");

  return !!node.dom.querySelector("span");
}
  
export {
  setup,
  expect,
};