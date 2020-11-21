import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";

export class Group implements Component {
  ani: Ani;
  pos: Position;
  components: Component[];
  draw(n: number): void {
    this.components.forEach((c) => {
      c.draw(n);
    });
  }
}
