import { BlurTextOptions } from "../options/blur-text-options";
import { FadeText } from "./fade-text";

export class BlurText extends FadeText {
  blur = 10;
  constructor(options: BlurTextOptions) {
    super(options);
    this.reset(options);
  }
  reset(options: BlurTextOptions = {}) {
    super.reset(options);
  }
  preRender(n: number) {
    super.preRender(n);
  }
  render(n: number) {
    this.ani.ctx.filter = `blur(${(1 - this.cAlpha) * this.blur}px)`;
    super.render(n);
  }
}
