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
  constructor(scene: BaseScene) {
    this.scene = scene;
    this.renderer = scene.renderer;
    this.hinter = scene.hinter;
  }
  cFrame: number = 0;
  get totalFrames(): number {
    return this.fps * this.sec;
  }
  timer: d3.Timer = null;
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
      const start = new Date().getTime();
      this.timer = d3.interval(async () => {
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
