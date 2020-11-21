import { easeBackOut } from "d3-ease";
import { scaleLinear } from "d3-scale";
import { FadeText } from "./fade-text";
import { RiseTextOptions } from "./rise-text-options";
class RiseText extends FadeText {
  offset: Function;
  private _offset: number;
  constructor(options: RiseTextOptions) {
    super(options);
  }
  reset(options: RiseTextOptions) {
    super.reset(options);
    if (options.offset == undefined) options.offset = 20;
    if (options.reverse) options.offset = -options.offset;
    this.offset = scaleLinear([0, 1], [options.offset, 0]);
  }
  preRender(n: number) {
    super.preRender(n);
    this._offset = this.offset(easeBackOut(this._alpha));
  }
  render(n: number) {
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = this.font;
    this.ani.ctx.fillText(this._text, 0, this._offset);
  }
}
export { RiseText };
