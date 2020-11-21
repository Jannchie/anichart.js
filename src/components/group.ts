import { Base } from ".";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";

export class Group extends Base {
  alpha: number | Function;
  ani: Ani;
  pos: Position | Function;
  components: Component[];

  preRender(n: number): void {
    return;
  }
  render(n: number): void {
    this.components.forEach((c) => {
      c.draw(n);
    });
  }
}
