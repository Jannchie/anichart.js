import * as _ from "lodash-es";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;
  protected _alpha: number;
  protected _position: Position;

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
    this._position = this.getValue(this.pos, n);
    this.ani.ctx.globalAlpha = this._alpha;
    this.ani.ctx.translate(this._position.x, this._position.y);
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
