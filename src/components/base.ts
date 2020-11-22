import { merge } from "lodash-es";
import Ani from "../base/ani";
import Position from "../utils/position";
import { Component } from "./component";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;
  protected _alpha: number;
  protected _pos: Position;
  components: Base[] = [];

  constructor(options: any) {
    this.reset(options);
  }

  reset(options: any): void {
    merge(this, options);
  }

  saveCtx(): void {
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

  restoreCtx(): void {
    this.ani.ctx.restore();
  }

  draw(n: number) {
    this.saveCtx();
    this.preRender(n);
    this.render(n);
    this.restoreCtx();
    if (this.components) {
      this.components.forEach((c) => {
        c.draw(n);
      });
    }
  }

  protected getValue(obj: any, n: number): any {
    return obj instanceof Function ? obj(n) : obj;
  }
}
