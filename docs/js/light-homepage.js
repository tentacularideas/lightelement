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

    footer {
      margin: auto;
      width: 80%;
      margin-top: 2em;
      margin-bottom: 1.5em;
      text-align: center;
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
    <section>
      <h2>DOM Events</h2>
      <p>Events can be easily listened within a web component with the <code>(&lt;event name&gt;)</code> attribute syntax. The following example illustrates that as a clickable div which counts its clicks.</p>
      <div class="example">
        <div>
          <h3>JavaScript</h3>
          <div class="content">
            <pre><code class="language-javascript">{{ this._demoCounterJs }}</code></pre>
          </div>
        </div>
        <div>
          <h3>HTML</h3>
          <div class="content">
            <pre><code class="language-html">{{ this._demoCounterHtml }}</code></pre>
          </div>
        </div>
        <div>
          <h3>Output</h3>
          <div id="demo-counter" class="content">
            <demo-counter></demo-counter>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <a href="https://buymeacoffee.com/julienvaslet">
      <img width="200" alt="Buy me a coffee" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABEIAAAEyCAMAAADJBoUtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGAUExURQAAAP/PAP/fAP/fAP/aAP/fAP/bAP/bAP/fAP/cAP/fAP/aAP/cAP/bAP/fAP/bAP/dAP/bAP/dAP/fAP/bAP/dAP/dAP/cAP/fAP/cAP/dAP/cAP/dAP/cAP/dAP/cAP/dAP/cAP/eAP/cAP/eAP/cAP/cAP/eAP/cAP/dAP/dAP/dAP/dAP/dAP/dAA0MIg0MIxwZIBwZISsmHSsmHismHzozGzozHDozHUlAGUlAGkpAGlhNF1hNGFlNF1lNGGdaFWdaFmhaFWhaFnZnE3ZnFHdnE3dnFIZ0EIZ0EYZ0EoZ1EYZ1EpWBD5WCDpWCD5WCEKSODKSODaSPDKSPDbObCrObC7OcCrOcC8KoCcKpCMKpCdG1B9G2BtG2B9K2BtK2B+DDBOHDBO/QAvDQAv/dAP/fEP/hIP/jMP/lQP/nT//nUP/oUP/qX//qYP/sb//scP/uf//ugP/vkP/wkP/yn//yoP/0r//0sP/2v//3v//4z//5z//73//97////yn7cuYAAAAvdFJOUwAQECAwMD9AT1BfYGBvb3Bwf39/gICOj4+Qnp+foK6vr76+v7/Nzs7P3t/t7u/+L2otzAAAKw1JREFUeNrtnf1/29Z1xlk7mdeuy7o2W9Y265qs6+rOjSgINCRMnAWRgwdLHGyIpUTBYgwQtOI2czPPbZeltv/1idQb7vvFm0iCz/eXfELRIHlfnnvOueee22jocevbH/zwp7/45a8mAIBa88tf/OzjD7/9XqNEbn/w8S/RsACsFL/62Yd3StGP93/wC7QmAKtpkHz87YL6ceuDn6EZAVhpFbldQEB+gNAHACvPx3cgIACAAnyaxxKBgAAAriyRrCJyB1swAIBrPvtBJh/m79BiAACCu/qGyPswQQAAjCHyPU0F+QBREAAAh7/9lo6CfB8NBQDI68zc+hjNBADIqyG3kM0OABBz7z0oCACgIg2BggAACmgI4iAAABXieAj2YgAAGhoi2Nv9AE0DANDgU35tMjQMAEAH7oGZW8hqBwBoaginhAhO1gEAdGHDIXfQKAAAbf6WlhC4MQCA/K4M9nMBAFkgd2VuwwgBAGQyQ76TlpC/R4MAADKRjqgiJQQAkJW/gRECAMjPPWzHAADyc70p8100BgAgM1ebMqgSAgDIYYa8h2AqACA/FwHVH6IlAAA5uAs/BgBQwJO5Az8GAFDQk8F+DAAgH7M9mZ+iHQAAubj3LeSVAQByMw2G3EIzAABySshfoVwZACA/P2o0vodWAADk5OdILAMA5Odeo/GPaAUAQE4++xYkBACQX0JuY08XAJBfQu40foVWAADklZA/b6ARAAC5JeS7kBAAACQEAAAJAQBAQgAAkBAAAICEAAAgIQAASIg+UTQMAs9znLZtW2Ya27bbTtfrBYPh0zH6DgBISFo5ngae07bMNV1Mu93tDZ+iDwFYcQkZD3uOtb6WF6vdG8ImAWA1JWQcdM21ErB2BhF6E4DVkpBxz14rEasLrwaA1ZGQQan6cREfCWCLALASEuKtr1XDDkQEgNpLyHBjrTLMAN0KQL0lxF+rFA/9CkCdJaRiBTlzZtCxANRXQqK1yumhZwGorYTsKOb/xsbWzo7r+QcHh8fHxyfRjOMphwcHnufubG1tKIKx6wm6FoCaSkgimvb3d1z/8ER3QyU6PvR2ttYRDgFgxSQk5KjHtnuYcy82Ofa373OeiK4FoKYS8oSd8J8XNWzOdISyR47RtwCsjITslHFO7mADAVUAVkBCTgRH97vBMKMzM44GPc8bXv5vnHZoOuhbAOopIZN1RREQb1pSKBLZJVH0dBD0PKdtXj7HvFSeOPVkE30LQE0lRDuz7KJS2QXT/+Orz/rJxZPd1IvY1gWgphIy2S47k2zr4sHHJYZoAQCLKiHJ/bI1JL54cMpKwWE7AOoqIaTHUQaXemFdv+SicwGorYRMDss97X/MStO/oXMBqK+EnInIVvmOTDrnBFsyANRaQiaT2C8rJrJ79UhsyQCwMhIynfIHWyUUQDTjqweuY0sGgBWSkCknB24xHdm6VpD0fjG2ZABYCQk515FDf2crc4h14/6Od3CSfs4etmQAWEUJuSA6PvS9na2t+xvSikTbO55/cMw7UTPAlgwAKywhaZIoOrkoVXZwXsDsOIpUB/ESbMkAAAkpwAa2ZACAhORnF/FUACAh+fHZw3cAAEiILieowQxAfSVkPOw6tt3u9sqodMglxv26ANRVQsbpu7jX7UqEZI/cAba6T9HJANRDQnxODur6zCR5WoKUjKNB4DkW+xHWCboZgBpIiLRGyLo1K5o6zFqBOYqGZCFV3EsFQD0lRL/KkGnZtuN0Pa8XBGeiQjA4eynwPM9x2rZp6h6tgYYAsOwSsrc2T3CrDADLLSHR2nzB1gwASy0hO3OWEKSZAbDMEjJvIwR37AKw1BLizl1CUD0EgCWWEGvuErKOvgZgaSUkIWol+wcH3k4ZNVMlgnF/x/Ncom4RSqkCsLQSEvKm8snB7v0K1GNj2z243H/Zw74uAHWQEE+U5ZUcH3jb99dL0o4d/zASxmA66GwAllVCttlLo0glOTn03e2tXFqycX97x+MXUiUu2bXQ2QAsq4RY2vkZ0fHxge+5O1tbWxsbfEVZ39i4v7W943oHB8cnqpSxXdRBBGDpJSQpcFolidJkloEniKcCsPQSEs4vw+ukgnjq+ClqkABwkxLizc+bSEqPpw7tZrNpODh0A9jFxWvbbXnV72HXtp0BJCQj9hwTvMq+V8ZvntMaYcYAamwYyqHhno8eu0Yr0I1IiDXHbZFUHLaMx0XNS6y0ZzMIel4QVFYQFiwDweXQMCKFghCjBxKSaRrfeMul82LjEp53NQaazdnjxoOubVy/ZrQDeDgrSmJeDQNb8JbB9UjpQULyTeMbv6TypOQUd/t6EEz9WqvJgjDJahJeD4GWegHqQEJyWgI3HU7dKfm8//VKY3SNpgCIyEpGQppNlZuSWoBcSEjOeMR/3OzP+/VayY5MU4tWiBm1cqRMDJEjswlHJifWnG6HGntEWmsZBlVTExR8XjlstZeSGiCHkJBM+kwWaJ/eQVV1ctb4adCzyQT5MkK5cRMaApQmhqDzR6nxEUJCsnDMverBbnvBsHSbJHo6vZDKrKhuWagtIc0jTKrVoqn0UtKjJ4aEZEJ2Atec3mc3KKol0dPpXXa2KfmgMjZkBvoSYiCmulLEai8lFXBtTiAhmfC1Ko2dX2g3GD7Vm3zj6U12gdd12pZ5UzXcA30JabYxrVaJUO2leKkFBhKSkczlydanV9q1HcfxSM5ecdp2hovsSt2PSQ8CNdiWWSUGai+lrc4cgYSIOFmfd/nlcsKbLuuvtN1+OIqiMPTb1J9szKsVIr26CLKf7FqOjZu6iuqgHldRUSph+4TPlfRN4s8ocrRCuOpAR2p0PICEZOZwrnbIVkmz2U7bH/vsQ2MLG7sriq32Upp1TE69OQmZxBvzu0PGL+tHpPb+9xOlyMCTWSE2lf0e13N1uTkJOXNm7s9HQNzy9uDVhzFjA57MSmIovZT0nk0ACclpifjbNywjGzsHZc5jDWc27ROjXOvqoPZSBvXcrbtZCZlxcuhtb91MZGSvZDMg0XBmQ2zrriIaXooPCSl3Nk4voapYSfyyv/RIx5k1ICEriIaX4tUyv31+EnKpJCfH/pmUlBBq3bi/s71RxUYuf5wEGvESSMjqoOGl7NYyv33uEpLWkkPf29neup9BTjY2tnZ2PP/g+PKCGb/8bDLBOBGrwyZiISuIhpdi1zK/fXEkhNST6OT4+PDgwJ8lte9c4U7/1z84ODg+Pom4J2mqvYg70JEQs5ZrTR7GQbdt221vuHBfyzZNu1vqVQyu2kvZVJc1I7/n0HPOmq87GGu0stMbQkLKEZ+SCx0KvVmxM5txoCwV0VC7Sv24d73qthZoD3N4XS67zK+l4aUYmTKGhu2r90tuLVqAVq6bhEw2qpQQV8PASHKW2H06nO8dEkOvfWY/SRbns9E6G9Strs5J6oCsLNuKiuhWEAxKapzIzlEYajz9BsFwGPWmTWRY3ae5vJRmhpExIr9nS1B9xi+vlZdOQsa9tt2t4geXfTaXoK3hzKacnT49Lrpn9nMgGdqc1SYaDG9iXAzT+dm8RW/spUZrW/WVxjZTTjbnrxh2Lx1Du4T7NXwjc3E5bpl+9ioptZeSJTnV16qCF5XWyksoIf56RQHPpOSrp0RLjaXxHtrZ2Tt/tcv5R6HBHwLnQ94Ky9aLs8daqcYfU8cHWz3V3JP3XGRySlJHBZVt2nQFZ8gep9q+NIRACCdBL7OXEqrLml3S0SodwW3lZEUk5CroWXoR2pNK76zZVDuzgXAoXY1fVkMig/9v9iqp971Hy+CIHYvtRG5USDWEN7bznBji2DLBhWszLklBpiKSZBcQtkvUXspAO7+9w62Cl2i1srMaEhJVd8duWGVaSGqp6WjMHtKPiSRHZxz+YjPSraI47Dr6+wsBLQN97j0WkWKwijVkbJZTgmlo8if8zCKygpIURDzrhqZ+RalYnd+unZy6p1XQu6xWXk4J8asLeT65fvS/lf/FlROImGyxKBRL2xSRYHFz9A6HX7ghtqYNa1OH0vuCu3CuHje2tEx53i8tYoaIvtelBFoZvZphxvJyruqyoETgpQjGhqd5eEpUXJMyQ5xyWnlJJcSrLv3LK7diuzAgxp8/fUNsz0quGfH5/yrSC+FfzXA7qw7ORE5YUdpWzaVRtimQ8eDynrKwZLY987HYpnC1nCiGbjYvZVevJSJTy3UqqZVrYIWUfbWoW2Vy6kheo5sKkMfCeFtHHIFN/y3QK1HjZjxBTg72yFB5+0Ez03onngKZIjp9jeK0mSJEEqPiQaZfwTULsiWnynIOnaZOe0u+X7AKElKOt3H625e/e/Xq5W9fPE+9uH396PKbMpQNkxHV9x2h/NCWbiKYFrbW5WdRVhvWID7MVF1jIRmsYcapmmG9kChbvrybiPhl+/vy5+goCNGPGl6KRlkzapzQ/aElNDdeEG0uEhIW3TZ5/uL1N2/fXfHmj/91etlPVWaWBcJhkk4S5BshgXjqhfxpGTW1zlTsZT15QdwNLXUXHMVgtVVTtWnY+TwPvSmcpQBp+mcYz0h9Zu1VS++qoExeiqml9eQ4sgy+iyJr5QerICHxWpEtmecvv07JxyXffDn740a5V08JYxapYTIeehy/+aFkCCfiOFuTLzqSYWFmPUKe+hWdkXyOJIrLt0KFHf4wIarJtnJN+FIcmYj+2q7M9HebeoRZvBStkCexnFhn/bnP7d5yWnmJJSSdQpo1+PPiNUc/prws+mSNWC05TKZ5z55jqsP1UyTZi4Jyq+mX+1pjTm/wpP6FbVIF6Y/6HcpSJ95huH2iSD1rMyfpPz+avWJkH9xB1hmcSZMe0bodSsLb579b6TOovZREywNzmDFkc74nIYiPqEj/akjIes4s9Oe/+/qdiBezfqo0OTVlrZqm1NQ2YskAcsXBidTfkqaWeeFkjw2IJsTjc2fcSFvqPrXckcVhDenkt+lW0x3c9ObJVLn8jjQ2kMEIaamCF1QcxthPx8lb4RFPE9VeykgnpyZixxDvdHjAdrq9YhKS7yzc8/9+++6dXELCSpNT7aYubiQxFg4lAbTrvw20ggiJkX1V3uR/50tL5yht4jNGheJY+yb7Rz/z4CYDNMbFF4s7+UMhAfM7Jde+kNn+dpwW3allsMf5/WovRSu/3WcUPW1fhBLn1Zvb+fD5SEiefZMXX7+TckpJyNY8JYQ5MeeLF71BU+nuulpzQ3dV3uV+4Ue8n2lxbBxZiT9eKkuQdXCTsULrukmoRPwMoZBNxs5vC9stYJolIfsnJduBvpcS6OyvmRx/hB0cI2kr2yshIbtZ6wI9/+837xTM3ldtcqrZzIInWNkMSeyuxf+wUEvVdFdlT7FBGsqjOzKfzOeoYZh1cDvCoBJpH+jHyyO2W8SxKZMR1pBqpTbz+zW8FJ389hEv/MVaSzw7MFitHZmMOaTPVQbIlLc5HpyVZja6/HFpS2z/B/ylONFasHVXZV6wshWrgiUh78+SJDmb/Tg383wnvxdpBmbw+TnKJjxZG7D7agPKfPCZ/tLwUnSKL/MUOGGlbpMzYIKMNVCWXUKe6KenPn/x+7fvNPiGNm8qKCSQUUJS57eSzIlleqEQJ8+qHEoCIcwqxxEL8dWwCe+JXkaNc4Tfi9S2DIllrLKJTSmTVamA0tEB0zMDtZeik99uc1p2xEhdxPswVyMLsU4SMqBDFv/zuy+48vG7r7X044z/O++D6weX35KjrBJybYdIoqmCxDJXKxRiNvWypgliVZIYz0yJuWaTLQ7rJKz3oRXujcQyEYlVT1v7+wrPI+D8aFpCYsYSKqn4Mu/XsebFgNfndg7/bpklhKnqMfVUvv7jq9+++GIaFX1+evri5avff/MuA7+fPceqMjk1zCwhV+uuJ16CXL4KaGW3B7mOaMZSgeC/wVV4K8xvsTmmQ3Y3K5Z0QJyr4z5nJSQQ+UoPmd4LBeEJDS9lU+2ChbxR4jDa5HJslSTPVvcyS0hMp2/84V1RXs+es15lcuogu4Rc1vloi8ePILFMy0PZzHc2Qpkpbkg1ZlP4D22OSzbIqHGm2Ffxc57T9djWTwQXhkW8OExAqw2jiuXkt/tyBU7Y9u9N5h5NnVfhQzqJ9HVhCfmK+9xS8bkiYTle/2gUTQmPZiWMOaaBOHww4avASGezNsy5x6lM8zSlB9pM4RznzUs72xcMJYZGu3go5AH7WicR2ECP2Bd7dAsk7DqgbnTRLG9zRgJns5a3uNg5/LvllhD6KMurwhLykrJu1sv/0sxmqO322bI3fYudnZJoaqhOLLO1Ao8Z0r1phWhJxjJnLgvn8YgzkcKMnocs29Zsap1dZjA4OjviJxLbvAzjgXhFiJl/ppHf7qqNystfl0rU7bOtbHCUL14RCbGosOfLwhJCJ6dWkKNHpGRZbiiycx4zZogkmuryPRZPY8RFzJm4nBLSl/5SWsTEejjguBlmRs9Dkg4T5fy5CfeRF71kHIne2uFI40WJEEZCyslv54wETibsgP2slNDceNGyeUnILpWe+mVhCfmCu9NTKqljCH6ibYwnE/5+PyecYfDtgJ6WEZIhjGaqzpq4Mo0R1/jzWFvdzbiDMpIYR4OcoZCQLzxH02awnwk/4nOesARUA2p7KRrXdnPMC45cpJvUzdnKdZAQurjYF4UlZFZ3qMJyaMRsV4WsHlMCIM5NjQSL/abaQ6GMECu3hHRULpshnGaByP/xmEVU73oCX2J9uapQyHisCoOTv2QURuKPaHEbzFZKiKuOxYfKt1yMhPSBvz6nlXtsK09WRULouX5aWELOh36VmWWpgaPc/GiTq5J4GzQQ7KkY6l1CJ/ehM1N1Zt6TaYwn9MpsWlv2Mm8Y2ZLvtSkPhUzP09qRPIZl6X+8y3fsQlIxzv+uccuURuYIY8SNeEdm2IjJHvekU90lhDnLUlRB3tD+Ufl3cqvrt1/zjFz4DOFMavOnRaJOGYskmRuZJKSlDByHmrPcJP9A1JJt6YX5JJUEIsUBGVNkyLv6uTOCrV5qtzWh207DS9HIHHFJ0R57fF/SkLVysjISwsQ93xSUkBtITk2Uw4S/YsbEItUXjtn0tBipPRRHdqovi4R0VBLSEhsDsSgcGE6GXSN7LulIYlYF8vjNgMzE4ct0Rz/wmghe76UVw2IlJFTqQ1NtAnXoa7DaguDw0MnRyrWQkJhOT/1TKRJSaXLqKMv+6W7athCPMDKzg/+6rZxsmrImkJBQJSEd4TQjJ0NaKW1DlkE/9LyBMmLQm0gMNls4R1351NQNvFqiR5xplE9/jUAtIW114Du9M0wVb03tPBOri6qVh/WVEKa62B8LSsh5fvt6lXdyhzklJCBGmOQ+IYs/lTo68Qw2ODB02oHSIxMMaE/yZHGlRckBADL5YjbbW4Hig8OJxGDzhBPQlk1NT7uLHwgjGa2U69Bh/xwr9cHSC1E12fJDilZucVr5qK4Swkz2ohnur2ZPrbTsYab0nd30auoJnQJTsIYEKg8lUGWY7p2PdrWEPFBKSCKcTbauhPR5QY2edK2mEz8GTXk01RAqrr6EBKJ3EsXhDOZdntpL2VQHZMTN91DYDgRHPDO1V1cJKTs9dZbfflJpcqqf5Uwssb8pjOeNRAFRXyEhnEsSQlZBROE15YHXXYnP4ArlRzy4H3EnqpHIZrshjf18LjQgDsuRkN6E154C00/DSzHV3pSw+Sz54sFvZV/cyvWQEJvKLSuanvobbpC2VNwsWVyb6WHbFu2buKJDLp4is8xRHLaNZHMmVh543ZWcvbGFu0CB3ti+fkIsm2iUchF2AKcHHPFWjb6EOMLQUsL3MqYfFhF3gFjK9UewdzbuCBUkET0pZyvXQ0Lo7dcvy8hvrzY5dTdDFldExDlt0XwUxjU9eZzUbyokxJap3UhZ+6st8ZAMoboEakeeaJuWdCGWJdBwfAFT/FBtCZHtzR5xfxp7CYit3I/huxaR8ParTiJxMnO1cj0khK5QWDQ9dVZ8udrkVDvDOQQyRL8p8OHDpsg4t6UjLmoqJGRPamSEygOvtnjBT8QRCf7gboWitulIJaQjizU+EP6mjlQQXe2dqkDD8OPBCy1Rly3z4shDs6knDbqt/O85NvuXS0LKTk891/pKk1M3M5wzNwllECQs0aMy5muEpxEIIbVCkQk5UGYSbIqX1bCpk1mWigQmwraJpS5WR2bheMIJfih1y6Q9tyed54le8W2OSA0NVTaw+Po8O9SSskytXBMJeUL7HMUU5Lz48nalyamGfhbXHpk7IbAVaGNCMEzoQTnmm7zXT+4rDrQGqlAIIQaeRH9i1YYMOwOuP92WR2k8mTwJL59oyfeXbE3nk9fHcdarui+6y+UFUGRWSsq26GtZoLJWrr4C0bwkhCl9WCw99Rs6Rlt+ZtlEv7gPfXZOMKMDoYSYEldDoCDX07mv8lM8VShkIlkzPWFmGVNkxN6PZfLUn+hbIYEiCebfZb830DqFFpkqh0RLQwK1h0Kruse/XtB0Qo1AumHvR7Ifc1hbCWGKA70pITl1o0oJibWr3ZCDsUeEDyQrqyGYMC0tBbmSkH5TdTLFVR3OSyQD3hOFSdK6aYXhKFIYaC3FB3dkrlsoanHerBvoVBmh25X39WJLLSGh2r5QR0HCs/ZLlKvTv05bOcneyjWREKZEYbH01P+lnznH5FRqMBJHZAzJytoSaUuijIOkJGRPmfShrkUiO6GzK/qbxs4mMQV8ubNIPMPSyaMTzpi4qdF1ttLdmPJQKSGfS30Y5jsObVVoXOxi2hqt3K+xhGyUmp46K75c7Z3cuhX8KAXpCG9dN0WrE60tqWnuG/KxSyUXdJSzJVRtbnYkEmKLYiQtjSmgCsKkUqJc1VqvmDGGcld3/EAd1GAFmsf1tx51+Z1lqwREMsD2MrZyK66xhNAn4l4Vz28/qfRO7kAvOZW693U6GvgSEohGXyQsbcqMuAf08XqzqXRjSO1KFD+VMVNEEmI21fUJ0lOAr25tnky4KnfBUUyqtmrl5iVl8LI6I7Ujc6lJgfAC5qtqhZ7QLxJ5yiPl6SaqwTqTGksIfTP3V8WLL1d7J7enlZxKmwmPJgIJ4Xgkn4t27drR2YB76jGDspVO2QzYDw9VcWHBnJMddtvlWyi+1jLqq97hslONG04I+IrXV34st02GhtbeisCLNJwO1aBRry22Fs9bbdiT3fHe04r4igI7vqa9vOwSQl9d+bJ4cmq1d3K7Gp7+0OIaELzl2RGNWa6tbBr8g5npYTey5RnPvJglf1GW3YrCl5DI0FlGR4ZqeSRMM+fpZDzsKqf39cRqaSze7C8ei5IyRkoFMS3HH5H31HiObcjtFLvrWIq38FtnrAgqs7/2JoyQ+UkInZ76onjx5Wrv5G4rJYT1bC88Cc6M5KWoT6vlCMcz/2h3ejjr5EnSkQ5XFSyxJloSYqkTrEididXyJp2G3IktjB2mZ2yXmpfklipxo24kU5DH15shu80yMAz5CGP34noKnb6ZCyHmJiG0yXBaPL+92uTUdEEYTorykLO7bzxj4gQhf9W+eK7jGJkUZCL7u2j/Un2FtOTiLMLJ6QijjLZibHe0N0YE0y3hTCxxeHGPdguveo0yciziNF9rJHZR24IIjqAzNFQxbktdFM5ufu5WroeEDKhTtc+L57fT4ZVyIdagVjddDyoKuOb2pYKQx3blW7PaWPFEKiHiWLynNIVlAYGAY+dwfK8T5qF9Q+fL+Zo/3+OYBuK99meUUg8ves1kT7SRv8WJBC4q8QuUuvdQaV0ZjwljRjMOk+Rs5XpICFP68G3h4ss3lZx6OYltx/M8py1ybK97cJd0VmRbs7o8SCZSCZEMH1cVkBvJzBTORS+86I0j+1RJnfFE0jSP0u04YkyDjp4JyXgNqZnO+QJ2bzjkrBD9DKaTFSodtAfUbUNGzoivq0wKqpGEMEkcbwrnt29UeSd3knWS2zF3aTVsKlovmjPPZDrzSKRrGguQrdoWlBYTTuh4niB6Q8YiyW0VWcrknuQ3E8HW9pl8G5o/WVZQjTAEJqJT/dJItal8bCx3c0JGnT2tiC9Va3pkqdycWkkIU/rw68L57ZXeyT3KqCD7ugP4mSkYpI9VQ05cJ0w6nUxVFmkiNVOIr9sWRm/SsUgqZCmN8gkPxHbkJkrzmWYwXO4ZTrRO9UsLEdA+zEQhIcZjXtQ3LcGB8APS1YjISyOocrW1lBDaZiiSnvp7rl1TKmE2E+SZtnVOHmpJLyH70lE5ER8RlzvB6oXqoewNultGVxrCBJof52no2br/QNcuYP1mQ1vy1af6pdeFE9P48qChePRY+/wsXCO4Ugb68kGD28q0s3Vj90HMT0LoO19eL01yqtok7muvgR2+K30uAvtSB0lY5+pBomtOCfa+k45kJZNpKTnYncE0jGDyIg4yuL/6seKzVQ9V+Cd2+oeqTuQ+lO0ZE+NgpGw0W9y0rd5wOODkE8auTivf3LV285OQ3RLTU2fFl6tNTtW3Qoz9RPsfz3Ze2SF7aUb0mb9cl4YYmSq7WL2nK9z77tuzsE2sSrKgfQGdrSRlU7Ma0nrG2EdZHyq06ZpsvQ2phnDaV/1bxaOnm3FL+2xoPNMJt09WQELcEtNTf8PLNCk5nKq5i2IfKXeEGamgh2zKEemnTQ3bTxQhemo9VW2bSva+E9E5cnHA8+xrq0+yWhphqsdUwFnpZOg8VKghnII9sa3poiok5EqjJTc3hJnWqZld2CmllZdfQujShy+K5rdXm5x67ag+6gsHmLk/ymLDXEkFWYiCVIH4yG3bdtvxw/Sw6OczQcgd5nz1aBLJJrZSaG2tsR13REYdN6ahOWGOTD0BkehNi9e+MtsrUrrBrSxmyPmIUQZ2Ojd5te78JKTM9NQvKM+oipKzlwtgZzbE2dFo2H4k/teOIup57bLYocaX6eu6UHIrJN/e92OJ+XOUMYwgbO0j17ZM03JD6ieNjPwTJt6ny62LGyzmLPW2z39r6i2+b/NiHcRBPyo+2tOP+l7uGvVLauUll5CQin4WSU99zovPls3M3bha5mfGwWwsGKbleP1IMSUslcsxnTNWe19HQPhDSEtACEMhb0krRzJs92VW+FFZ3aC/wUNbIp3LjjCdvry9YlINbGHXhKQok1/w/B9R9xn2icvxtENu10WWK2/lpZAQpvRh0fz2Su/kPu/ffpjbQkzamV0OrU0VzvjSnYP5E6AtiTuwX7l5va+KTSiIxGUZ6U4L+57rOK7XHyV6kfaEXi5cervWZnQwVNuXjHnqaOhM7SUkoTPB3hTMb1+vMjm1BNLbK+Z+gY7mn9HL8Jv7bbNppmOzmXkoiRDsa0ctc68++9al8xguQMcGtEWRMMXXdum9krQ/Rl2SKogY97WCNXNokPlJCJOe+qdFTk4tx4rxHNu2HbcfFXmK4IzezY6d650ittA4Zz/DcEcl27Bhv98fLUa3+swubmxQu17shXqPhSnA3CgMZ9fIEmeyrYqE0PXW86en/i/XMaorVnMBJGQaDPI9X+DZhR1SP8Jadwjnnpo9KpWVcyWqLd5bJ6P1hshePCKKG5nzauU5Sgh9Nj+/hLymwrNWnQfsXnMxJEQVRZhZXHa7oMm1ZBJymfqeilnPfBvOlaih9Ixx6Lv2ucUqM7WSo/327G3eHFt5jhJC38z9qlh+e7V3ci8MQXMpJGSV4NX52CODVLyqJrbiwPSyMEcJoVPB8qenzoovV3sn96IgLlYECVkACbnK8UjI10zOMeVA7+gyJETME2rOf1lacqpX3+FKRiof2pCQhZKQQ05HTQc3L3aacnYCSEguaM/ji2ISslvpndwLgk+dxvQgIQsl6yGnp6wJv4Z/6t95kJBc0Ifz82e4z4ovV52cuhBujEElhHpFk9VBRRIyIiId3CMxvlbNRkiImJguEbToyanzx6FPkns18afrIiHXnZAQrgtXQgZZahVAQniUlZ76dva09Srv5F4MBswhPY9nIIO5SUgqgSN9e3DCTUWNCx9WWnkJoUsf5k1P/YYWpLqOVWI3ZnaYahcSslASknq1nfJuYn42ez06b54SYlHRiz8WyW8/qX9yasCejLXrsZDVUUJ2U/stfCskVf8NEpKP3ZLSU2fFl1cgOdWkKyamX7IxlRdXQib8TFSzFoGseUoIXfrwVZH89vonpwZsfe6kWY+gfl0kxICE3Cx0Pmne9NSveA+rtxFyYXOEzXqkFiw3ba43CQm5AejSh18WyW93656cGnIuc/ILlkEFpTjkXAlppyXE4EqIIbnxCxKiNSmo8MUXRZJTt+uenOpw7kJykFm2UBJicN2bMG1vpCQkwY5MUeKS0lNnxZftmmeWRbwbJTexp7sA8JNzjLSEbPIueBnV46juPCUkKSk9dVZ8eaPmEhJwrkCLmtiQWQB8noQkhODbvI4KkJ1aGDqh9G2B/Pa1mien2pzrUgPl1ZbgZtX9eugNCF3Z5amFU48FYK4SQqen5stwf8O1aGrsx7Q44RFEU+fHiBeRcggvxeX5LGY9FoC5SohN5ZZ9XUpyqlnHYRrwLpY3cchuEYg5VVBTxUBssvsSjp3Sg4TkhC7x8Yf8EhLWPLPM4Vz3EDaR3r4QGKw5QfmYI2nhw+Wu9TJXCaFLH77On99e7Z3c82dT7scgN3Ux4lRXgW6T9DETNgcwEN4CAQnRh84o/Sp/8eWK7+SeOwo/BqGQeeIyYuDQO/DMYaa0yCz3oa65SsgTyvt4mT+/vebJqekrMA/rtowtPamoRnf2wh4T/N6lvJax1ayLDTlXCaFjoC9ySchvpv+UvpSmZoScUIjZ5OUrgZsn5aY0e5PxkKiR7dJ63xpOIs+oT/H9uUoIfQHdaf789ponpwZs/d6AkygC5h0MEV3OkUjeseSx8LlKCF368Hn+4ssbC34nd/kSYsKPWRh8tT5IVKYDCcnPRhnpqTwxqr+E7DWxH7M4nowh1Ic+xxWliCEh+aFLH+ZJT31LS8ik5hIyk8gRLrJbJFy1k2LU1AiZs4Rsl5Ce+g0VVallcmq6dvt0x2loNpFXtkDEKiNkMnlcUyNkzhKyS23F/qGE/Pat2g9Rx+sKhimYF3vqSKnFf8ujCSSkAF4JuWWzyqlhzZNTxWYwjJDFiIaYSgsjrGnvzVdCnlB1y07z7uk+qXlyqtjZbjZHmMALwIgn8o+Jt/BcmVYMCSnm4tOXv3yd76h/2pxZgcqpTfZCGTBv+mof5SHzDuPZBBJSzMVfozLCsuen/tfsQdu1v5NblFfQQk7IgnAkt0F4GtKqgYLMWULShYJ6ucyQNxcTrPZ3cgvMEAOFQhbHlyHiIS3eVnufeItdi86br4SkSx+e76Q8z5Ya8uaUkaK6rsr7XAk5wsxdJGfmylY09vnjMO5fbczYNUnnmbOEbNCezOT0TXYFYcKyteQhxwbBfu6CkYR9z/P6shB3fORP31KbpW7OEpKKYaztnL90qu/LfHM6YfyYGtchZuyQWrjSABJShL2UhKydXLz4Us8QefvVVZxgrfahkPP1q0PuxSCSClZeQo7TEnL/akq8eP1/chl586fXL64eMt6oeXp72pW+9LYNF4FUAAkh4qlXrswVp6dfvHjx4uXLl6/OOPvPy7P/Oz09lXlD/7ka3nYf+WQAEsJ6MmvbOUzzcSoQsraOpRmAlZKQmJCQNfPXWR/w6/SmTk1TUwGAhAjZJTVkrT3MYoH0LFKB0KEArJiEJOuUhqyZ3eFYQz2GPcek/+kxOhSAFZOQ9GUyqQQx2/F6wSXDC6Lo6XA4CHpdx1rn/Su4MQCsnoSkr4ApBm63B2AVJWSyU46C7KI3AVhJCSnHDoENAsCqSgiVHZILH30JwMpKyCTeKCYg9z9HVwKwwhIymRwUEJH1PXQkACsuIWcispVXQHBiFQBIyNSd8TOryPoO0skAgIRckRz77pamT7OxvXcMAwQASAhLdHx84Hvuzs721pQNgq3tHdc/OIF6AAAJAQBAQgAAkBAAAICEAAAgIQAASAgAABICAACQEABAZRLyK7QCACCvhNxp/BKtAADILyG/QCsAAPJKyHuNn6IVAAB5JeRbjR+iFQAAObnXaHwPrQAAyMmnjca30QoAgJz8Q6NxC60AAMjHZ3/VaGBXFwCQV0LunEnI36MdAAD5JORMQRBPBQDk5NOphNxGOwAAchkh01BIA/mpAIB8EvLeTEI+REsAAHJwd6YgjffREgCAHHx0LiGNf0RTAACy+zG3LyQEezIAgOx8eqEgjVsoOwQAyGyEfOdSQhBQBQBk5u6VgsAMAQAUMEJghgAAChghMEMAAEWMEJghAIACRsgZd9EkAAB9I+Q9SkLuoE0AANoK8qMGzUdoFQCArhtzm5GQW3BlAACaRsifNVjev4eGAQDoKMj3GzxwVAYAoMNPGnywswsAUMMJhFzwYzQOACC3gjRu/TOaBwAg5V/ECgINAQCoFOT9RgMaAgCoREEQDwEASLh7u6Hkw8/QTgAADp/9XENBGo3vQUMAABwF+fGthha3kesOAKC595cNXW59BEMEAECYIP90u5GBOzBEAAApE+SvGxn5ECICALgwQX5yu5GZ2z+GNwMAOBOQT/6skYvbP74LFQFgxfUjt4DM+O7PISIArLCA3Pvr241i3P7o559BRgBYSf340Z1GGdz+7k/ufgYdAWCV3Jd7n3xYjn5cporc+eCjTz65e+8zAECtuXv3kx99+Bfa7sv/A+MlP2sAyvyVAAAAAElFTkSuQmCC" />
    </a>
  </footer>
  `;

  _demoHelloJs;
  _demoHelloHtml;
  _demoShapesJs;
  _demoShapesHtml;
  _demoCounterJs;
  _demoCounterHtml;

  async onInit() {
    this._demoHelloJs = await this._getCode("./js/demo/demo-hello.js");
    this._demoHelloHtml = this._getHtmlCode("demo-hello");
    this._demoShapesJs = await this._getCode("./js/demo/demo-shapes.js");
    this._demoShapesHtml = this._getHtmlCode("demo-shapes");
    this._demoCounterJs = await this._getCode("./js/demo/demo-counter.js");
    this._demoCounterHtml = this._getHtmlCode("demo-counter");

    Array.from(this.getDom().querySelectorAll("pre > code")).forEach((element) => {
      hljs.highlightElement(element);
    });

    this._scrollToSection();
  }

  _scrollToSection() {
    if (!document.location.hash.match(/^#[0-9a-z-]+$/)) {
      return;
    }

    const target = this.getDom().querySelector(document.location.hash);
    
    if (!target) {
      return;
    }

    target.parentElement.scrollIntoView();
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
 * --
 * if
 * for
 * let
 * dispatchevent
 * public methods
 * limitations (array, object -> update())
 */

Homepage.register();
