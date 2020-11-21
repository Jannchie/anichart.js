import { Base } from ".";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { TextOptions } from "./text-options";
class Text extends Base {
  ani: Ani;
  alpha: number | Function;
  font: string;
  text: string | Function;
  pos: Position | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;
  protected _text: string;
  constructor(options: TextOptions) {
    super(options);
  }
  preRender(n: number) {
    super.preRender(n);
    this._text = this.text instanceof Function ? this.text(n) : this.text;
  }
  public render(n: number): void {
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = this.font;
    this.ani.ctx.fillText(this._text, 0, 0);
  }
}
export { Text, TextOptions };
