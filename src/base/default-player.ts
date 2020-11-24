import { Hinter } from "./hint";
import { interval, Timer } from "d3";
import { Player } from "./player";
import { Renderer } from "./base";

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
      const start = new Date().getTime();
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
