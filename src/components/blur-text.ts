import { BlurTextOptions } from "../options/blur-text-options";
import { FadeText } from "./fade-text";

export class BlurText extends FadeText {
  private _blur: number;
  constructor(options: BlurTextOptions) {
    super(options);
  }
  reset(options: BlurTextOptions) {
    super.reset(options);
    this._blur = options.blur ? options.blur : 10;
  }
  preRender(n: number) {
    super.preRender(n);
  }
  render(n: number) {
    this.ani.ctx.filter = `blur(${(1 - this._alpha) * this._blur}px)`;
    super.render(n);
  }
}
