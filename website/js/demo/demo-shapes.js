class DemoShapes extends LightElement {
  static tagName = "demo-shapes";
  static css = `
    div {
      width: {{ this.size }}em;
      height: {{ this.size }}em;
      background: #87c056;
      border: 0.15em solid #67a036;
      transition: all ease-in-out 0.5s;

      &.rectangle {
        border-radius: {{ this.size / 10 }}em;
      }

      &.circle {
        border-radius: {{ (this.size / 2) + 2 }}em;
      }
    }
  `;
  static html = `
    <div [class]="this.shape"></div>
  `;

  size;
  shape;
}

DemoShapes.register();
