import { DefaultHinter, Hintable, Hinter } from "./hint";
import { Component } from "../components";
import { DefaultComponentManager, Renderer, Shape } from "./base";
import { DefaultPlayer } from "./default-player";
import { Playable } from "./playable";
import { Player } from "./player";
import { DefaultRenderer } from "./defaut-renderer";
import * as _ from "lodash";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
export interface PlayerOptions {
  sec?: number;
  fps?: number;
}

export interface SceneOptions {
  renderer?: {
    shape?: Shape;
  };
  player?: PlayerOptions;
}
export class DefaultSceneOptions {
  renderer: {
    shape: { height: 1366; weight: 768 };
  };
  player: {
    fps: 60;
    sec: 5;
  };
}
export abstract class BaseScene implements Playable, Hintable {
  renderer: Renderer;
  componentManager: DefaultComponentManager;
  hinter: Hinter;
  player: Player;
  output: boolean = false;

  setCanvas(selector: string = "canvas") {
    this.renderer.setCanvas(selector);
  }
  update() {
    this.player.renderer = this.renderer;
    this.componentManager.components.forEach((c) => {
      c.player = this.player;
      c.renderer = this.renderer;
      c.ctx = this.renderer.ctx;
      this.hinter.drawHint(`Update Component: ${c.constructor.name}`);
      c.update();
    });
    if (this.renderer.canvas) {
      this.renderer.canvas.width = this.renderer.shape.width;
      this.renderer.canvas.height = this.renderer.shape.height;
    }
  }
}
export class Scene extends BaseScene {
  constructor(options: SceneOptions = {}) {
    super();
    this.init(options);
    this.update();
  }
  private init(options: SceneOptions) {
    this.hinter = new DefaultHinter();
    this.componentManager = new DefaultComponentManager();
    this.renderer = new DefaultRenderer(this.hinter, this.componentManager);
    this.player = new DefaultPlayer(this.renderer, this.hinter);
    _.merge(this, options);
  }

  addComponent(c: Component) {
    this.componentManager.addComponent(c);
    c.player = this.player;
    c.renderer = this.renderer;
    c.update();
    this.hinter.drawHint(`Component Added: ${c.constructor.name}`);
  }
}
