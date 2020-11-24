import { ColorPicker } from "./color";
import { Groupable } from "./../components/group";
type Shape = { width: number; height: number };

export interface Render extends Groupable, ColorPicker {
  shape: Shape;
}

export interface Renderable {
  render: Render;
  draw(): void;
}

export class DefaultRender implements Renderable {
  render: Render;
  draw(): void {
    throw new Error("Method not implemented.");
  }
}

export interface Player {
  fps: number;
  sec: number;
  cFrame: number;
  totalFrames: number;
}
export interface Playable extends Renderable {
  player: Player;
  play(): void;
}

export class Scene implements Playable {
  player: Player;
  play(): void {
    throw new Error("Method not implemented.");
  }
  render: Render;
  draw(): void {
    throw new Error("Method not implemented.");
  }
}
export class Series extends Scene {}
