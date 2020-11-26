import { easeBackOut } from "d3-ease";
import { scaleLinear } from "d3-scale";
import { FadeText } from "./fade-text";
import { RiseTextOptions } from "../options/rise-text-options";
class RiseText extends FadeText {
  offsetYFunc: (sec: number) => number;
  private offsetY: number;
  reverse: any;
  constructor(options: RiseTextOptions) {
    super(options);
  }

  update() {
    super.update();
    if (this.offsetY === undefined) this.offsetY = 20;
    if (this.reverse) this.offsetY = -this.offsetY;
    this.offsetYFunc = scaleLinear([0, 1], [this.offsetY, 0]);
  }
  preRender() {
    super.preRender();
    this.offsetY = this.offsetYFunc(easeBackOut(this.cAlpha));
  }
  render() {
    this.player.renderer.ctx.fillText(this._text, 0, this.offsetY);
  }
}
export { RiseText };
