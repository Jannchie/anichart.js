import * as d3 from "d3";
import * as _ from "lodash-es";
import { Scene } from "./Scene";
import { SceneOptions } from "../options/SceneOptions";
import { BaseScene } from "./BaseScene";
export class Series extends BaseScene {
  private scenes: Scene[] = [];
  constructor(options: SceneOptions = {}) {
    super(options);
    this.update();
  }

  setCanvas(selector?: string) {
    this.renderer.setCanvas(selector);
    this.scenes.forEach((s) => {
      s.setCanvas(selector);
    });
  }

  play() {
    this.update();
    this.hinter.drawHint("Now, Play Series");
    let delay = 0;
    this.scenes.forEach((s) => {
      d3.timeout(() => {
        s.player.play();
      }, delay);
      delay += s.player.sec * 1000;
    });
  }

  addScene(s: Scene) {
    s.hinter = this.hinter;
    this.scenes.push(s);
  }

  update() {
    if (this.scenes)
      this.scenes.forEach((s) => {
        s.player.fps = this.player.fps;
        s.renderer.canvas = this.renderer.canvas;
        s.renderer.ctx = this.renderer.ctx;
        s.renderer.shape = this.renderer.shape;
        s.update();
      });
  }
}
