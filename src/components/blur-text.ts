import { BlurTextOptions } from "../options/blur-text-options";
import { FadeText } from "./fade-text";

export class BlurText extends FadeText {
  blur = 10;
  constructor(options: BlurTextOptions) {
    super(options);
    this.update(options);
  }
  update(options: BlurTextOptions = {}) {
    super.update(options);
  }
  preRender() {
    super.preRender();
  }
  render() {
    this.player.renderer.ctx.filter = `blur(${
      (1 - this.cAlpha) * this.blur
    }px)`;
    super.render();
  }
}
