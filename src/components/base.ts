import { DefaultHinter } from "./../base/hint";
import { Hintable, Hinter } from "./../../dist/base/hint.d";
import { DefaultShadowOptions } from "./../options/shadow-options";
import { merge } from "lodash-es";
import Ani from "../base/ani";
import { FontOptions } from "../options/font-options";
import { ShadowOptions } from "../options/shadow-options";
import Pos from "../utils/position";
import { Component } from "./component";
import { Player, Renderer } from "../base/base";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
export abstract class Base implements Component, Hintable {
  alpha: number | Function;
  ani: Ani;
  pos: Pos | Function;
  protected cAlpha: number;
  protected cPos: Pos;
  hinter: Hinter = new DefaultHinter();
  renderer: Renderer;
  player: Player;

  constructor(init?: Partial<Base>) {
    Object.assign(this, init);
  }

  shadow: ShadowOptions;
  font: FontOptions;
  ctx: EnhancedCanvasRenderingContext2D;

  update(options: any = {}): void {
    merge(this, options);
    this.shadow = merge(new DefaultShadowOptions(), this.shadow);
  }

  saveCtx(): void {
    this.ctx.save();
  }
  preRender() {
    let n = this.player.cFrame;

    if (this.pos == undefined) this.pos = { x: 0, y: 0 };
    this.cAlpha =
      this.alpha instanceof Function
        ? this.alpha(n / this.player.fps)
        : this.alpha;
    this.cPos = this.getValue(this.pos, n);
    this.ctx.globalAlpha = this.cAlpha;
    this.ctx.translate(this.cPos.x, this.cPos.y);
    if (this.shadow && this.shadow.enable) {
      this.ctx.shadowBlur = this.shadow.blur;
      this.ctx.shadowColor = this.shadow.color;
      this.ctx.shadowOffsetX = this.shadow.offset.x;
      this.ctx.shadowOffsetY = this.shadow.offset.y;
    }
  }

  abstract render(): void;

  restoreCtx(): void {
    this.ctx.restore();
  }

  draw() {
    try {
      this.saveCtx();
      this.preRender();
      this.render();
      this.restoreCtx();
    } catch (e) {
      console.error(e);
    }
  }

  protected getValue(obj: any, n: number): any {
    return obj instanceof Function ? obj(n) : obj;
  }
}
