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
  text: string;
  pos: Position | Function;
  fillStyle: string | CanvasGradient | CanvasPattern;
  alhpaScale: ScaleLinear<number, number, never>;

  constructor(options: TextOptions) {
    super(options);
    // 计算显示时间
    if (options.time !== undefined) {
      let fade = options.fade != undefined ? options.fade : 0;
      let last = options.last != undefined ? options.last : 2;
      this.alpha = scaleLinear(
        [
          options.time - fade,
          options.time,
          options.time + last,
          options.time + last + fade,
        ],
        [0, 1, 1, 0]
      ).clamp(true);
    }
  }

  public render(n: number): void {
    let alpha =
      this.alpha instanceof Function
        ? this.alpha(n / this.ani.fps)
        : this.alpha;
    let position = this.pos instanceof Function ? this.pos(n) : this.pos;

    this.ani.ctx.fillStyle = this.fillStyle;
    this.ani.ctx.font = this.font;

    this.ani.ctx.globalAlpha = alpha;

    this.ani.ctx.fillText(this.text, position.x, position.y);
  }
}
export { Text, TextOptions };
