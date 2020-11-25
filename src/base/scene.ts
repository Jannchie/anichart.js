import * as _ from "lodash";
import { Component } from "../components";
import { DefaultComponentManager } from "../default/default-component-manager";
import { DefaultPlayer } from "../default/default-player";
import { DefaultRenderer } from "../default/defaut-renderer";
import { SceneOptions } from "../options/scene-options";
import { BaseScene } from "./base-scene";
import { DefaultHinter } from "../default/default-hinter";

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
