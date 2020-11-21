import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
import * as _ from "lodash-es";
export abstract class Base implements Component {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;

  constructor(options: object) {
    this.reset(options);
  }

  reset(options: object): void {
    _.merge(this, options);
  }

  preRender(n: number) {
    if (this.alpha instanceof Function) {
    }
  }

  private saveCtx(): void {
    this.ani.ctx.save();
  }

  abstract render(n: number): void;

  private restoreCtx(): void {
    this.ani.ctx.restore();
  }

  draw(n: number) {
    this.preRender(n);
    this.saveCtx();
    this.render(n);
    this.restoreCtx();
  }
}
