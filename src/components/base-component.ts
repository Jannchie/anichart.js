import Position from "../utils/position";
import { Component } from "./component";
export class BaseComponent implements Component {
  draw(n: number, pos?: Position): void {
    throw new Error("Method not implemented.");
  }
}
