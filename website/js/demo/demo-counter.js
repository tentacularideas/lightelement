class DemoCounter extends LightElement {
  static tagName = "demo-counter";
  static css = `
    div {
      cursor: pointer;
      user-select: none;
    }
  `;
  static html = `
    <div (click)="this._incrementCounter()">
      You clicked me {{ this._count }} time{{ this._count != 1 ? 's' : '' }}.
    </div>
  `;

  _count;

  onInit() {
    this._count = 0;
  }

  _incrementCounter() {
    this._count++;
  }
}

DemoCounter.register();
