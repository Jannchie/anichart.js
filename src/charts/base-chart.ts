import { merge } from "lodash-es";
import enhanceCtx from "../ctx";
import { select } from "d3-selection";
import Ani from "./ani";
import { Component } from "../components/index";

class BaseChart implements Ani {
  fps: number;
  sec: number;
  totalFrames: number;
  components: Component[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(options: object = {}) {
    this.fps = 12;
    this.sec = 120;
    this.width = 1366;
    this.height = 768;
    this.components = [];
    this.setOptions(options);
  }
  output: boolean;
  ready(): void {
    throw new Error("Method not implemented.");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
  draw(frame: number): void {
    throw new Error("Method not implemented.");
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
      this.canvas = <HTMLCanvasElement>select(selector).node();
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
      this.canvas = <HTMLCanvasElement>select(selector).node();
    } else {
      this.initCanvas();
    }
    this.ctx = this.canvas.getContext("2d");
    enhanceCtx(this.ctx);
  }
  initCanvas(parent: string = "body"): void {
    this.canvas = select(parent)
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
      component.draw(n);
    });
  }
}
export { BaseChart };
