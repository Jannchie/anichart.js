import { Timer } from "d3";
import { Hintable } from "./hint";
import { Renderable } from "./renderable";

export interface Player extends Renderable, Hintable {
  fps: number;
  sec: number;
  cFrame: number;
  timer: Timer;
  totalFrames: number;
  drawFrame(frame: number): void;
  play(): void;
}
