import * as d3 from "d3";
import { Ani } from "./ani/Ani";
import { canvasRenderer, CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
import { addFrameToFFmpeg, ffmpeg, outputMP4 } from "./FFmpeg";
import { recourse } from "./Recourse";

export class Stage {
  aniRoot: Ani = new Ani();
  compRoot: Component = new Component();
  renderer: CanvasRenderer;

  options = { sec: 5, fps: 30 };
  interval: d3.Timer;
  output: boolean;
  mode = "output";
  cFrame = 0;
  get totalFrames() {
    return this.options.sec * this.options.fps;
  }
  get canvas() {
    return this.renderer.canvas;
  }
  constructor(canvas?: HTMLCanvasElement) {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      document.body.appendChild(canvas);
    }
    this.renderer = canvasRenderer;
    this.renderer.setCanvas(canvas);
  }

  addChild(child: Ani | Component) {
    this.aniRoot.children.push(child);
  }

  private preRender(sec: number) {
    this.compRoot = new Component();
    this.aniRoot.children.forEach((child) => {
      if (child instanceof Component) {
        this.compRoot.children.push(child);
      } else {
        this.compRoot.children.push(child.getComponent(sec));
      }
    });
    this.renderer.clean();
  }

  render(sec: number) {
    this.preRender(sec);
    this.renderer.render(this.compRoot);
  }

  loadRecourse() {
    return recourse.setup();
  }

  play(): void {
    let frame = 0;
    this.loadRecourse().then(() => {
      this.setup();
      if (this.interval) {
        this.interval.stop();
        this.interval = null;
        return;
      }
      if (this.output) {
        ffmpeg.load().then(() => {
          const promises = [];
          while (this.cFrame < this.totalFrames) {
            this.cFrame++;
            this.render(this.cFrame / this.options.fps);
            promises.push(addFrameToFFmpeg(this.canvas, frame++));
          }
          Promise.all(promises).then(() => {
            outputMP4(this.options.fps);
          });
        });
      } else {
        this.interval = d3.interval((elapsed) => {
          if (this.output || this.mode === "output") {
            this.cFrame++;
          } else {
            this.cFrame = Math.floor((elapsed / 1000) * this.options.fps);
          }
          this.render(this.cFrame / this.options.fps);
          if (this.cFrame >= this.totalFrames) {
            this.interval.stop();
          }
        }, (1 / this.options.fps) * 1000);
      }
    });
  }
  setup() {
    this.aniRoot.children.forEach((child) => {
      child.setup();
    });
  }
}
