import { select } from "d3";
import { BaseScene } from "../base/BaseScene";
import { Scene } from "../base/Scene";
import { Hinter, Renderer } from "../interface";
import { ColorPicker } from "../interface/color-picker";
import { Shape } from "../types/shape";
import {
  enhanceCtx,
  EnhancedCanvasRenderingContext2D,
} from "../utils/enhance-ctx";
import { DefaultColorPicker } from "./DefaultColorPicker";

export class DefaultRenderer implements Renderer {
  public get hinter(): Hinter {
    return this.scene.hinter;
  }
  public set hinter(value: Hinter) {
    this.hinter = value;
  }
  scene: BaseScene;
  get componentManager() {
    return this.scene.componentManager;
  }
  set componentManager(val) {
    this.scene.componentManager = val;
  }
  shape = {} as Shape;
  get width() {
    return this.shape.width;
  }
  set width(value) {
    this.shape.width = value;
  }
  get height() {
    return this.shape.height;
  }
  set height(value) {
    this.shape.height = value;
  }
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  colorPicker: ColorPicker = new DefaultColorPicker();
  constructor(scene: BaseScene) {
    this.scene = scene;
  }
  draw(): void {
    if (this.componentManager) {
      this.componentManager.components.forEach((c) => {
        c.draw();
      });
    }
  }
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D {
    if (typeof window !== "undefined") {
      this.canvas = select(selector).node() as HTMLCanvasElement;
      if (!this.canvas || this.canvas.getContext === undefined) {
        this.initCanvas();
      }
    } else {
      const { createCanvas } = require("canvas");
      this.canvas = createCanvas(this.shape.width, this.shape.height);
    }
    this.ctx = enhanceCtx(this.canvas.getContext("2d"));
    this.hinter.ctx = this.ctx;
    return this.ctx;
  }

  private initCanvas(): void {
    this.canvas = select("body")
      .append("canvas")
      .attr("width", this.shape.width)
      .attr("height", this.shape.height)
      .node();
  }
}
