import * as d3 from "d3";
import { BaseScene } from "../base/BaseScene";
import { Hinter } from "../interface/Hinter";
import { Player } from "../interface/player";
import { Renderer } from "../interface/Renderer";

export class DefaultPlayer implements Player {
  fps: number = 30;
  sec: number = 5;
  scene: BaseScene;
  renderer: Renderer;
  hinter: Hinter;
  mode: string;
  constructor(scene: BaseScene) {
    this.scene = scene;
    this.renderer = scene.renderer;
    this.hinter = scene.hinter;
  }
  cFrame: number = 0;
  get totalFrames(): number {
    return this.fps * this.sec;
  }
  interval: d3.Timer = null;
  output: boolean = false;
  drawFrame(frame: number) {
    this.cFrame = frame;
    this.renderer.draw();
  }
  drawNextFrame() {
    this.cFrame++;
    this.renderer.draw();
  }
  play(): void {
    if (this.interval) {
      this.interval.stop();
      this.interval = null;
      return;
    }
    if (this.output) {
      while (this.cFrame < this.totalFrames) {
        this.cFrame++;
        this.renderer.draw();
      }
    } else {
      const start = new Date().getTime();
      let count = 0;
      this.interval = d3.interval((elapsed) => {
        if (this.output || this.mode === "output") {
          this.cFrame++;
        } else {
          this.cFrame = Math.floor((elapsed / 1000) * this.fps);
        }
        this.renderer.draw();
        count++;
        if (this.cFrame >= this.totalFrames) {
          this.interval.stop();
          this.hinter.drawHint(
            `Finished! FPS: ${(
              count /
              ((new Date().getTime() - start) / 1000)
            ).toFixed(2)}`
          );
        }
      }, (1 / this.fps) * 1000);
    }
  }
}
