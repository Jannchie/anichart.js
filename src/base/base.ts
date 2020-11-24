import { Background } from "./../components/background";
import { DefaultHinter, Hintable, Hinter } from "./hint";
import { interval, select, Timer } from "d3";
import { Component } from "../components";
import {
  enhanceCtx,
  EnhancedCanvasRenderingContext2D,
} from "../utils/enhance-ctx";
import { Colorable, ColorPicker, DefaultColorPicker } from "./color";
import { Scene } from "./scene";
export type Shape = { width: number; height: number };
export interface ComponentManager {
  components: Component[];
  addComponent(c: Component): void;
}
export class DefaultComponentManager implements ComponentManager {
  components: Component[] = [new Background()];
  addComponent(c: Component): void {
    this.components.push(c);
  }
}
export interface Combinable {
  componentManager: ComponentManager;
}

export interface Renderer extends Colorable, Combinable, Hintable {
  shape: Shape;
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  draw(): void;
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}

export interface Renderable {
  renderer: Renderer;
}

export class DefaultRenderer implements Renderer {
  hinter: Hinter;
  componentManager: ComponentManager;
  shape = { width: 1366, height: 768 };
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  colorPicker: ColorPicker = new DefaultColorPicker();
  constructor(hinter: Hinter, componentManager?: ComponentManager) {
    this.hinter = hinter;
    if (componentManager) this.componentManager = componentManager;
  }
  draw(): void {
    if (this.componentManager) {
      this.componentManager.components.forEach((c) => {
        c.draw();
      });
    }
  }
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D {
    if (typeof window != "undefined") {
      this.canvas = <HTMLCanvasElement>select(selector).node();
      if (!this.canvas || this.canvas.getContext == undefined) {
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

export interface Player extends Renderable, Hintable {
  fps: number;
  sec: number;
  cFrame: number;
  totalFrames: number;
  timer: Timer;
  drawFrame(frame: number): void;
  play(): void;
}

export interface Playable {
  player: Player;
}
export class DefaultPlayer implements Player {
  fps: number = 30;
  sec: number = 5;
  constructor(renderer: Renderer, hinter: Hinter) {
    this.renderer = renderer;
    this.hinter = hinter;
  }
  renderer: Renderer;
  hinter: Hinter;
  cFrame: number = 0;
  public get totalFrames(): number {
    return this.fps * this.sec;
  }
  timer: Timer;
  output: boolean = false;
  drawFrame(frame: number) {
    this.cFrame = frame;
    this.renderer.draw();
  }
  play(): void {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
      return;
    }
    if (this.output) {
      while (this.cFrame < this.totalFrames) {
        this.cFrame++;
        this.renderer.draw();
      }
    } else {
      let start = new Date().getTime();
      this.timer = interval(async () => {
        this.cFrame++;
        this.renderer.draw();
        if (this.cFrame >= this.totalFrames) {
          this.timer.stop();
          this.hinter.drawHint(
            `Finished! FPS: ${(
              (this.sec * this.fps) /
              ((new Date().getTime() - start) / 1000)
            ).toFixed(2)}`
          );
        }
      }, (1 / this.fps) * 1000);
    }
  }
}
