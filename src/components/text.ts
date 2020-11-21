import { ScaleLinear, scaleLinear } from "d3-scale";
import { Base } from ".";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
import { TextOptions } from "./text-options";
class Text extends Base {
  ani: Ani;
  alpha: number | Function;
  font: string;
  text: string | Function;
  pos: Position | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;

  constructor(options: TextOptions) {
    super(options);
  }

  public render(n: number): void {
    let text = this.text instanceof Function ? this.text(n) : this.text;
    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = this.font;
    this.ani.ctx.fillText(text, 0, 0);
  }
}
export { Text, TextOptions };
