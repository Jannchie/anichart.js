import { ScaleLinear, scaleLinear } from "d3-scale";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
import { TextOptions } from "./text-options";
class Text implements Component {
  private scale: ScaleLinear<any, any, any>;
  public ani: Ani;
  public font: string;
  public text: string;
  public pos: Position;
  public fillStyle: string | CanvasGradient | CanvasPattern;

  constructor(options: TextOptions) {
    this.reset(options);
  }
  public reset(options: TextOptions) {
    this.ani = options.anichart;

    if (options.text != undefined) {
      this.text = options.text;
    }

    if (options.font !== undefined) {
      this.font = options.font;
    }

    if (options.fillStyle !== undefined) {
      this.fillStyle = options.fillStyle;
    }
    if (!this.pos) {
      this.pos = options.pos;
    } else {
      if (this.pos.x === undefined) this.pos.x = options.pos.x;
      if (this.pos.y === undefined) this.pos.y = options.pos.y;
    }

    // 计算显示时间
    if (options.time !== undefined) {
      let fade = options.fade != undefined ? options.fade : 0;
      let last = options.last != undefined ? options.last : 2;
      this.scale = scaleLinear(
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
  public draw(n: number, pos?: Position): void {
    if (pos) {
      this.pos = pos;
    }
    let alpha = this.scale(n / this.ani.fps);
    if (
      !this.ani ||
      this.pos != undefined ||
      this.scale != undefined ||
      alpha > 0
    ) {
      this.ani.ctx.save();
      this.ani.ctx.fillStyle = this.fillStyle;
      this.ani.ctx.font = this.font;
      this.ani.ctx.globalAlpha = alpha;
      this.ani.ctx.fillText(this.text, this.pos.x, this.pos.y);
      this.ani.ctx.restore();
    }
  }
}
export { Text, TextOptions };
