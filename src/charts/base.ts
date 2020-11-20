import { merge } from "lodash";
import * as d3 from "d3";
import { enhanceCtx } from "../ctx";
import { BaseComponent } from "../components/BaseComponent";

class AniBaseChart {
  fps: number;
  sec: number;
  totalFrames: number;
  components: BaseComponent[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(options = {}) {
    this.fps = 12;
    this.sec = 120;
    this.width = 1366;
    this.height = 768;
    this.components = [];
    this.setOptions(options);
  }
  setOptions(options: object): void {
    merge(this, options);
    this.calOptions();
  }
  calOptions(): void {
    this.totalFrames = this.fps * this.sec;
  }

  setCanvas(selector: string): void {
    if (typeof window != "undefined") {
      this.canvas = <HTMLCanvasElement>d3.select(selector).node();
      if (this.canvas.getContext == undefined) {
        this.initCanvas(selector);
      }
    } else {
      const { createCanvas } = require("canvas");
      this.canvas = createCanvas(this.width, this.height);
    }
  }
  selectCanvas(selector: string = "canvas"): void {
    if (typeof window != "undefined") {
      this.canvas = <HTMLCanvasElement>d3.select(selector).node();
    } else {
      this.initCanvas();
    }
    this.ctx = this.canvas.getContext("2d");
    enhanceCtx(this.ctx);
  }
  initCanvas(parent: string = "body"): void {
    this.canvas = d3
      .select(parent)
      .append("canvas")
      .attr("width", this.width)
      .attr("height", this.height)
      .node();
    this.ctx = this.canvas.getContext("2d");
    enhanceCtx(this.ctx);
  }

  preRender() {}
  drawFrame(n: number) {
    this.components.forEach((component) => {
      component.drawFrame(n, this.ctx);
    });
  }
}
export { AniBaseChart as Base };
