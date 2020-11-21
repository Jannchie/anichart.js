import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
import * as _ from "lodash-es";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;

  constructor(options: any) {
    this.reset(options);
  }

  reset(options: any): void {
    _.merge(this, options);
  }

  private saveCtx(): void {
    this.ani.ctx.save();
  }
  preRender(n: number) {
    let alpha =
      this.alpha instanceof Function
        ? this.alpha(n / this.ani.fps)
        : this.alpha;
    this.ani.ctx.globalAlpha = alpha;
    let position = this.pos instanceof Function ? this.pos(n) : this.pos;
    this.ani.ctx.translate(position.x, position.y);
  }
  abstract render(n: number): void;

  private restoreCtx(): void {
    this.ani.ctx.restore();
  }

  draw(n: number) {
    this.saveCtx();
    this.preRender(n);
    this.render(n);
    this.restoreCtx();
  }
}
