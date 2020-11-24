import * as d3 from "d3";
import * as _ from "lodash";
import { Scene } from ".";
import { DefaultPlayer } from "../default/default-player";
import { DefaultRenderer } from "../default/defaut-renderer";
import { SceneOptions } from "../options/scene-options";
import { BaseScene } from "./base-scene";
import { DefaultHinter } from "./hint";

export class Series extends BaseScene {
  private scenes: Scene[] = [];
  constructor(options: SceneOptions = {}) {
    super();
    this.init(options);
    this.update();
  }

  setCanvas(selector?: string) {
    this.renderer.setCanvas(selector);
    this.scenes.forEach((s) => {
      s.setCanvas(selector);
    });
  }

  private init(options: SceneOptions) {
    this.hinter = new DefaultHinter();
    this.renderer = new DefaultRenderer(this.hinter);
    this.player = new DefaultPlayer(this.renderer, this.hinter);
    _.merge(this, options);
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
    this.scenes.push(s);
  }

  update() {
    if (this.scenes)
      this.scenes.forEach((s) => {
        _.merge(s.hinter, this.hinter);
        _.merge(s.player, this.player);
        _.merge(s.renderer, this.renderer);
        // 场景选项覆盖
        s.update();
      });
  }
}
