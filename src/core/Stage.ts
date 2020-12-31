import * as d3 from "d3";
import { Ani } from "./ani/Ani";
import { CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
import { recourse } from "./Recourse";

export class Stage {
  aniRoot: Ani = new Ani();
  compRoot: Component = new Component();
  renderer: CanvasRenderer;

  options = { sec: 5, fps: 144 };
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
    this.renderer = new CanvasRenderer(canvas);
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
    this.loadRecourse().then(() => {
      if (this.interval) {
        this.interval.stop();
        this.interval = null;
        return;
      }
      if (this.output) {
        while (this.cFrame < this.totalFrames) {
          this.cFrame++;
          this.render(Math.floor(this.cFrame / this.options.fps));
        }
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
}
