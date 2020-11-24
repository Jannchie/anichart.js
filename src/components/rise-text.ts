import { easeBackOut } from "d3-ease";
import { scaleLinear } from "d3-scale";
import { FadeText } from "./fade-text";
import { RiseTextOptions } from "../options/rise-text-options";
class RiseText extends FadeText {
  offsetYFunc: Function;
  private offsetY: number;
  constructor(options: RiseTextOptions) {
    super(options);
  }
  update(options: RiseTextOptions = {}) {
    super.update(options);
    if (options.offsetY == undefined) options.offsetY = 20;
    if (options.reverse) options.offsetY = -options.offsetY;

    this.offsetYFunc = scaleLinear([0, 1], [options.offsetY, 0]);
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
