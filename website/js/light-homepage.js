class Homepage extends LightElement {
  static tagName = "light-homepage";
  static css = `
    body {
      font-family: "Noto Sans", sans-serif;
      font-weight: 300;
      color: var(--color);
    }

    code {
      font-family: "Inconsolata", monospace;
      font-optical-sizing: auto;
      font-weight: 300;
      font-style: normal;
      font-variation-settings:
        "wdth" 100;
    }

    p code,
    ul code {
      padding: 0.15em 0.4em;
      border: 1px solid transparent;
      border-radius: 0.5em;
      background-color: #f0f1f4;
      font-weight: 400;
    }

    header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 2em;
      margin-bottom: 2em;
      border-bottom: 0.1em solid #000000;
      text-align: center;

      h1 {
        margin-top: 0.2em;
        margin-bottom: 0;
        font-size: 3em;
        font-weight: 200;
      }

      h1 + p {
        margin-top: 0.5em;
        margin-bottom: 1em;
        font-size: 1.5em;
        font-weight: 100;
      }
    }

    main {
      margin: auto;
      width: 80%;

      h2 {
        font-size: 1.3em;
        font-weight: 400;
      }
    }

    div.example {
      margin-top: 2em;
      margin-bottom: 2em;

      & > div {
        margin-bottom: 1em;
        border: 1px solid #e5e7eb;
        border-radius: 0.5em;

        & > h3 {
          margin: 0;
          padding: 0.5rem 1rem;
          font-size: 1em;
          font-weight: 400;
          border: 1px solid transparent;
          border-bottom-color: #e5e7eb;
          border-top-left-radius: 0.5em;
          border-top-right-radius: 0.5em;
          background-color: #f6f7f9;
        }

        & > div.content {
          padding: 1em;

          pre {
            margin: 0;
            padding: 0;

            & > code {
              margin: 0;
              padding: 0;
              border-bottom-left-radius: 0.5em;
              border-bottom-right-radius: 0.5em;
            }
          }
        }
      }
    }

    demo-hello + button,
    demo-shapes + button {
      margin-top: 1em;
    }

    button {
      padding: 0.5em 1em;
      font-family: "Noto Sans", sans-serif;
      font-weight: 300;
      border: 1px solid #e5e7eb;
      border-radius: 0.5em;
      background-color: #f6f7f9;
      cursor: pointer;
      transition: all ease-in-out 0.2s;

      &:hover {
        border-color: #dddee3;
        filter: drop-shadow(0px 0px 1px #00000022);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  `;
  static html = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
  <header>
    <lightelement-logo px="128"></lightelement-logo>
    <h1>LightElement</h1>
    <p>Lightweight event based web components</p>
  </header>
  <main>
    <section>
      <p>LightElement is a JavaScript library for creating Web Components from classes. The syntax is inspired by Angular one but there is no compilation needed!</p>
      <p>This is currently in an alpha state, not recommended for production use yet.</p>
      <p>I develop LightElement in my spare time to support some personal projects. Why sticking to JavaScript? I started working on this in 2023 during a paternity leave. I only had an iPad as a computer and I didn't find a good way to work with any compiled language. I still develop with my iPad but now using a VS Code Server hosted on a Raspberry Pi.</p>
    </section>
    <section>
      <h2>DOM mutations</h2>
      <p>The foundation of the library is to link variables to DOM parts. Every time a variable is updated, associated DOM parts are mutated.</p>
      <p>In the following example, a <code>demo-hello</code> web component is created with a <code>name</code> public attribute. The two buttons allow you to change the name to experiment the DOM dynamic update.</p>
      <div class="example">
        <div>
          <h3>JavaScript</h3>
          <div class="content">
            <pre><code class="language-javascript">{{ this._demoHelloJs }}</code></pre>
          </div>
        </div>
        <div>
          <h3>HTML</h3>
          <div class="content">
            <pre><code class="language-html">{{ this._demoHelloHtml }}</code></pre>
          </div>
        </div>
        <div>
          <h3>Output</h3>
          <div id="demo-hello" class="content">
            <demo-hello name="John"></demo-hello>
            <button onclick="this.parentElement.querySelector('demo-hello').setAttribute('name', 'Jane');">Jane</button>
            <button onclick="this.parentElement.querySelector('demo-hello').setAttribute('name', 'John');">John</button>
          </div>
        </div>
      </div>
      <p>Variables can also be used to mutate tag attributes or CSS. In the following example, the buttons allow you change the <code>shape</code> and <code>size</code> attributes to respectively mutate a tag attribute and the CSS.
      </ul>
      <div class="example">
        <div>
          <h3>JavaScript</h3>
          <div class="content">
            <pre><code class="language-javascript">{{ this._demoShapesJs }}</code></pre>
          </div>
        </div>
        <div>
          <h3>HTML</h3>
          <div class="content">
            <pre><code class="language-html">{{ this._demoShapesHtml }}</code></pre>
          </div>
        </div>
        <div>
          <h3>Output</h3>
          <div id="demo-shapes" class="content">
            <demo-shapes size="5" shape="rectangle"></demo-shapes>
            <button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('shape', 'circle');">Circle</button>
            <button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('shape', 'rectangle');">Rectangle</button>
            <button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('size', '10');">Big</button>
            <button onclick="this.parentElement.querySelector('demo-shapes').setAttribute('size', '5');">Small</button>
          </div>
        </div>
      </div>
    </section>
  </main>
  `;

  _demoHelloJs;
  _demoHelloHtml;
  _demoShapesJs;
  _demoShapesHtml;

  async onInit() {
    this._demoHelloJs = await this._getCode("./js/demo/demo-hello.js");
    this._demoHelloHtml = this._getHtmlCode("demo-shapes");
    this._demoShapesJs = await this._getCode("./js/demo/demo-shapes.js");
    this._demoShapesHtml = this._getHtmlCode("demo-shapes");

    Array.from(this.getDom().querySelectorAll("pre > code")).forEach((element) => {
      hljs.highlightElement(element);
    });
  }

  _getHtmlCode(id) {
    const tag = this.getDom().querySelector(`#${id}`);
    let content = !!tag ? tag.innerHTML : "";

    // Trim empty leading and ending lines
    content = content.replace(/^[ \t]*\n(?:[ \t]*\n)*/, "");
    content = content.replace(/\s+$/, "");

    // Tab to spaces
    content = content.replace(/\t/g, "  ");

    // Get initial indentation size
    const indentation = content.match(/^\s*/)[0].length;

    // Remove initial indentation from all lines
    content = content.replace(new RegExp(`^[ ]{${indentation}}`, "gm"), "");

    return content;
  }

  async _getCode(url) {
    const result = await fetch(url);
    return await result.text();
  }
}

/*
 * input
 * dom mutation
 * attribute
 * events
 * if
 * for
 * let
 * dispatchevent
 * public methods
 * limitations (array, object -> update())
 */

Homepage.register();
