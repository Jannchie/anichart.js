import { DefaultRenderer } from "./../default/DefaultRenderer";
import { DefaultHinter } from "./../default/DefaultHinter";
import { SceneOptions } from "../options/SceneOptions";
import { DefaultComponentManager } from "../default/DefaultComponentManager";
import { Hintable } from "../interface/hintable";
import { Hinter } from "../interface/Hinter";
import { Playable } from "../interface/playable";
import { Player } from "../interface/player";
import { Renderer } from "../interface/Renderer";
import { DefaultPlayer } from "../default/DefaultPlayer";

export abstract class BaseScene implements Playable, Hintable {
  renderer: Renderer;
  componentManager: DefaultComponentManager;
  hinter: Hinter;
  player: Player;
  output: boolean = false;

  setCanvas(selector: string = "canvas") {
    this.renderer.setCanvas(selector);
  }

  constructor(o: SceneOptions) {
    this.init();
    this.setOptions(o);
  }
  init() {
    this.hinter = new DefaultHinter(this);
    this.renderer = new DefaultRenderer(this);
    this.player = new DefaultPlayer(this);
  }
  setOptions(o: SceneOptions) {
    this.player.fps = o.fps ? o.fps : 30;
    this.player.sec = o.sec ? o.sec : 5;
    this.renderer.height = o.height ? o.height : 768;
    this.renderer.width = o.width ? o.width : 1366;
    this.renderer.shape = o.shape ? o.shape : { height: 768, width: 1366 };
  }
  update() {
    this.player.renderer = this.renderer;
    this.componentManager.components.forEach((c) => {
      this.hinter.drawHint(`Update Component: ${c.constructor.name}`);
      c.update();
    });
    if (this.renderer.canvas) {
      this.renderer.canvas.width = this.renderer.shape.width;
      this.renderer.canvas.height = this.renderer.shape.height;
    }
  }
}
