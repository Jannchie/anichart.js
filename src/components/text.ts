import { FontOptions, DefaultFontOptions } from "../options/FontOptions";
import { BaseComponent } from "./BaseComponent";
import { TextOptions } from "../options/text-options";
import { Pos } from "../types/position";
import * as _ from "lodash-es";
class Text extends BaseComponent {
  text: string | ((n: number) => string);
  fillStyle: string | CanvasGradient | CanvasPattern;
  offset: Pos | ((sec: number) => Pos);
  _text: string;
  font: FontOptions;
  protected cOffset: Pos;
  private finalFont: FontOptions;
  constructor(options: TextOptions) {
    super(options);
  }
  update() {
    super.update();
    this.finalFont = _.merge(new DefaultFontOptions(), this.font);
    if (!this.offset) this.offset = { x: 0, y: 0 };
  }
  preRender() {
    super.preRender();
    this._text = this.getValue(this.text, this.player.cFrame);
    this.cOffset = this.getValue(this.offset, this.player.cFrame);
    this.player.renderer.ctx.translate(this.cOffset.x, this.cOffset.y);
    this.player.renderer.ctx.fillStyle = this.fillStyle;
    this.player.renderer.ctx.setFontOptions(this.finalFont);
  }
  public render(): void {
    this.player.renderer.ctx.fillText(this._text, 0, 0);
  }
}
export { Text };
