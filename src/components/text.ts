import { Base } from ".";
import { TextOptions } from "../options/text-options";
import { Position } from "../utils/position";
class Text extends Base {
  font: string;
  fontSize: number;
  text: string | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;
  offset: Position | Function;
  _text: string;
  protected _offset: Position;
  constructor(options: TextOptions) {
    super(options);
  }
  preRender(n: number) {
    super.preRender(n);
    this._text = this.getValue(this.text, n);
    this._offset = this.getValue(this.offset, n);
    this.ani.ctx.translate(this._offset.x, this._offset.y);
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = `${this.fontSize}px ${this.font}`;
  }
  public render(n: number): void {
    this.ani.ctx.fillText(this._text, 0, 0);
  }
}
export { Text };
