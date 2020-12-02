import { DefaultHinter } from "./../default/DefaultHinter";
import { merge } from "lodash-es";
import { Scene } from "../base";
import { Hintable, Hinter, Player, Renderer } from "../interface";
import { FontOptions } from "../options/font-options";
import { DefaultShadowOptions, ShadowOptions } from "../options/shadow-options";
import Pos from "../types/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Component } from "./component";

export abstract class BaseComponent implements Component, Hintable {
  alpha: number | ((n: number) => number) = 1;
  pos: Pos | ((n: number) => Pos) = { x: 0, y: 0 };
  protected cAlpha: number;
  protected cPos: Pos;

  get renderer() {
    return this.scene ? this.scene.renderer : null;
  }
  set renderer(val) {
    this.scene.renderer = val;
  }

  get player() {
    return this.scene ? this.scene.player : null;
  }
  set player(val) {
    this.scene.player = val;
  }

  get hinter() {
    if (this.scene) {
      return this.scene.hinter;
    } else {
      return new DefaultHinter();
    }
  }
  set hinter(val) {
    this.scene.hinter = val;
  }

  constructor(init?: Partial<BaseComponent>) {
    Object.assign(this, init);
    if (this.scene) {
      this.renderer = this.scene.renderer;
      this.player = this.scene.player;
    }
  }
  scene: Scene;

  shadow: ShadowOptions;
  font: FontOptions;
  public get ctx(): EnhancedCanvasRenderingContext2D {
    return this.scene.renderer.ctx;
  }
  public set ctx(value: EnhancedCanvasRenderingContext2D) {
    this.ctx = value;
  }

  update(): void {
    this.shadow = merge(new DefaultShadowOptions(), this.shadow);
  }

  saveCtx(): void {
    this.ctx.save();
  }
  preRender() {
    const n = this.player.cFrame;
    if (this.pos === undefined) this.pos = { x: 0, y: 0 };
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
      // tslint:disable-next-line:no-console
      console.error(e);
    }
  }

  protected getValue(obj: any, n: number): any {
    n /= this.player.fps;
    return obj instanceof Function ? obj(n) : obj;
  }
}
