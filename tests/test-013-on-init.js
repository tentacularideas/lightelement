class Test013 extends LightElement {
  static tagName = "test-013";
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

    console.log(`[constructor] ${this.value}`);
  }

  onInit() {
    console.log(`[onInit] ${this.value}`);
    this._count++;
  }

  onChange(_) {
    console.log(`[onChange] ${this.value}`);
  }
}

Test013.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test013.tagName} value="Hello" />`;
}
  
async function expect(rootNode) {
  const node = rootNode.querySelector(Test013.tagName);  
  return !!node.dom.querySelector("span");
}
  
export {
  setup,
  expect,
};