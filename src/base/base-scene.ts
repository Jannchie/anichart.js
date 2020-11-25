import { DefaultComponentManager } from "../default/default-component-manager";
import { Hintable } from "../interface/hintable";
import { Hinter } from "../interface/hinter";
import { Playable } from "../interface/playable";
import { Player } from "../interface/player";
import { Renderer } from "../interface/renderer";

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
