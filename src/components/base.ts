import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export class Base implements Component {
  ani: Ani;
  pos: Position;
  draw(n: number): void {
    throw new Error("Method not implemented.");
  }
}
