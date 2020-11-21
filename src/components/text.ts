import { Base } from ".";
import { TextOptions } from "../options/text-options";
class Text extends Base {
  font: string;
  fontSize: number;
  text: string | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;
  protected _text: string;
  constructor(options: TextOptions) {
    super(options);
  }
  preRender(n: number) {
    super.preRender(n);
    this._text = this.getValue(this.text, n);
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = `${this.fontSize}px ${this.font}`;
  }
  public render(n: number): void {
    this.ani.ctx.fillText(this._text, 0, 0);
  }
}
export { Text };
