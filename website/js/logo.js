class LightElementLogo extends LightElement {
  static tagName = "lightelement-logo";
  static css = `
    :host {
      display: block;
      position: relative;
      width: {{ this.px }}px;
      height: {{ this.px }}px;
      border: 5px solid #ffffff;
      filter: drop-shadow(0px 0px 1px #00000077);
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
  `;
  static html = `
    <div *for="let beam of this._beams" class="beam" [style]="'background-color: ' + beam.color + '; transform: rotate(' + beam.deg + 'deg);'"></div>
    <p>&lt;/&gt;</p>
  `;

  px;
  _beams;

  constructor(shell) {
    super(shell);
    this.px ||= "512";
    this._beams = [
      {color: "#ff7676", deg: 0},
      {color: "#ff9857", deg: 17},
      {color: "#ffe961", deg: 27},
      {color: "#87c056", deg: 39},
      {color: "#4462c8", deg: 51},
      {color: "#6642c2", deg: 63},
      {color: "#aa63d8", deg: 75},
    ];
  }
}

LightElementLogo.register();
