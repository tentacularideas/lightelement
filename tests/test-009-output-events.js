class Test009 extends LightElement {
  static tagName = "test-009";
  static css = ``;
  static html = `
    <button (click)="this.emitEvent()">{{ this.text }}</button>
  `;
    
  text = "Click me!";

  emitEvent() {
    console.log("hey!!");
    this.dispatchEvent(new Event("customEvent"));
  }
}

Test009.register();

function setup(rootNode) {
  rootNode.innerHTML = `<${Test009.tagName} />`;
}

function expect(rootNode) {
  const node = rootNode.querySelector(Test009.tagName);
  let eventReceived = false;

  node.addEventListener("customEvent", function() {
    eventReceived = true;
  });

  const button = node.dom.querySelector("button");
  button.click();

  // Should wait a few ms

  return eventReceived;
}

export {
  setup,
  expect,
};