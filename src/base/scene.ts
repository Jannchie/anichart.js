import { Component } from "../components";
import { DefaultComponentManager } from "../default/DefaultComponentManager";
import { BaseScene } from "./BaseScene";

export class Scene extends BaseScene {
  init() {
    super.init();
    this.componentManager = new DefaultComponentManager(this);
  }
  addComponent(c: Component) {
    this.componentManager.addComponent(c);
    c.scene = this;
    c.update();
    this.hinter.drawHint(`Component Added: ${c.constructor.name}`);
  }
  play() {
    this.player.play();
  }
}
