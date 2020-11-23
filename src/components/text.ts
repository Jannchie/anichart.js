import {
  FontOptions,
  DefaultFontOptions,
  Fontable,
} from "./../options/font-options";
import { Base } from ".";
import { TextOptions } from "../options/text-options";
import { Position } from "../utils/position";
import * as _ from "lodash";
class Text extends Base {
  text: string | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;
  offset: Position | Function = { x: 0, y: 0 };
  _text: string;
  font: FontOptions;
  protected cOffset: Position;
  private finalFont: FontOptions;
  constructor(options: TextOptions) {
    super(options);
  }
  reset(options: TextOptions = {}) {
    super.reset(options);
    this.finalFont = _.merge(new DefaultFontOptions(), this.font);
  }
  preRender(n: number) {
    super.preRender(n);
    this._text = this.getValue(this.text, n);
    this.cOffset = this.getValue(this.offset, n);
    this.ani.ctx.translate(this.cOffset.x, this.cOffset.y);
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.setFontOptions(this.finalFont);
  }
  public render(n: number): void {
    this.ani.ctx.fillText(this._text, 0, 0);
  }
}
export { Text };
