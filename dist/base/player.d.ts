import { Hintable } from "./hint";
import { Timer } from "d3";
import { Renderable } from "./renderable";
export interface Player extends Renderable, Hintable {
    fps: number;
    sec: number;
    cFrame: number;
    totalFrames: number;
    timer: Timer;
    drawFrame(frame: number): void;
    play(): void;
}
