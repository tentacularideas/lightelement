class LightElementLogo extends LightElement {
  static tagName = "lightelement-logo";
  static css = `
    :host {
      display: block;
      position: relative;
      width: {{ this.px }}px;
      height: {{ this.px }}px;
      border: 1px solid transparent;
      border-radius: {{ Math.round(this.px / 10) }}px;
      overflow: hidden;
    }

    p {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
      text-align: center;
      font-family: Arial;
      font-size: {{ Math.round(this.px / 1.65) }}px;
      line-height: 1.665em;
      z-index: 100;
      color: white;
      filter: drop-shadow(1px 1px 1px black);
    }

    div.beam {
      position: absolute;
      bottom: {{ this.px / -8 }}px;
      right: {{ this.px / -8 }}px;
      height: {{ this.px / 2 }}px;
      width: {{ 2 * this.px }}px;
      transform-origin: bottom right;
      z-index: 10;
    }

    div.beam:nth-child(1 of div.beam) {
      background-color: #ff7676;
      transform: rotate(0deg);
    }

    div.beam:nth-child(2 of div.beam) {
      background-color: #ff9857;
      transform: rotate(17deg);
    }

    div.beam:nth-child(3 of div.beam) {
      background-color: #ffe961;
      transform: rotate(27deg);
    }

    div.beam:nth-child(4 of div.beam) {
      background-color: #87c056;
      transform: rotate(39deg);
    }

    div.beam:nth-child(5 of div.beam) {
      background-color: #4462c8;
      transform: rotate(51deg);
    }

    div.beam:nth-child(6 of div.beam) {
      background-color: #6642c2;
      transform: rotate(63deg);
    }

    div.beam:nth-child(7 of div.beam) {
      background-color: #aa63d8;
      transform: rotate(75deg);
    }
  `;
  static html = `
    <div class="beam"></div>
    <div class="beam"></div>
    <div class="beam"></div>
    <div class="beam"></div>
    <div class="beam"></div>
    <div class="beam"></div>
    <div class="beam"></div>
    <p>&lt;/&gt;</p>
  `;

  px;

  constructor(shell) {
    super(shell);
    this.px ||= "512";
  }
}

LightElementLogo.register();
