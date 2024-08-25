# LightElement
> Lightweight event based web components

LightElement is a JavaScript library for creating Web Components from classes. The syntax is inspired by Angular one but there is no compilation needed!

This is currently in an alpha state, not recommended for production use yet.

I develop LightElement in my spare time to support some personal projects. Why sticking to JavaScript? I started working on this in 2023 during a paternity leave. I only had an iPad as a computer and I didn't find a good way to work with any compiled language. I still develop with my iPad but now using a VS Code Server hosted on a Raspberry Pi.

DOM mutations
The foundation of the library is to link variables to DOM parts. Every time a variable is updated, associated DOM parts are mutated.

In the following example, a `demo-hello` web component is created with a `name` public attribute. The two buttons allow you to change the `name` to experiment the DOM dynamic update.

```javascript
class DemoHello extends LightElement {
  static tagName = "demo-hello";
  static html = `Hello {{ this.name }}!`;

  name;
}

DemoHello.register();
```

```html
<demo-hello name="John"></demo-hello>
<button onclick="this.parentElement.querySelector('demo-hello').setAttribute('name', 'Jane');">Jane</button>
<button onclick="this.parentElement.querySelector('demo-hello').setAttribute('name', 'John');">John</button>
```

[See live example](https://tentacularideas.github.io/lightelement/#demo-hello)

Variables can also be used to mutate tag attributes or CSS. In the following example, the buttons allow you change the `shape` and `size` attributes to respectively mutate a tag attribute and the CSS.

```javascript
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
```

```html
<demo-shapes size="5" shape="rectangle"></demo-shapes>
<button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('shape', 'circle');">Circle</button>
<button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('shape', 'rectangle');">Rectangle</button>
<button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('size', '10');">Big</button>
<button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('size', '5');">Small</button>
```

[See live example](https://tentacularideas.github.io/lightelement/#demo-shapes)

## Events

Events can be easily listened within a web component with the `(<event name>)` attribute syntax. The following example illustrates that as a clickable div which counts its clicks.

```javascript
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
```

```html
<demo-counter></demo-counter>
```

[See live example](https://tentacularideas.github.io/lightelement/#demo-counter)
