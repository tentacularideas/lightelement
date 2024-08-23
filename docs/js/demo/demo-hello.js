class DemoHello extends LightElement {
  static tagName = "demo-hello";
  static html = `Hello {{ this.name }}!`;

  name;
}

DemoHello.register();
