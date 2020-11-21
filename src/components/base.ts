import * as _ from "lodash-es";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;
  _alpha: number;
  _pos: Position;

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
    this._alpha =
      this.alpha instanceof Function
        ? this.alpha(n / this.ani.fps)
        : this.alpha;
    this._pos = this.getValue(this.pos, n);
    this.ani.ctx.globalAlpha = this._alpha;
    this.ani.ctx.translate(this._pos.x, this._pos.y);
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

  protected getValue(obj: any, n: number): any {
    return obj instanceof Function ? obj(n) : obj;
  }
}
