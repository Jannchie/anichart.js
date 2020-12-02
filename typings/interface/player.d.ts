import { Timer } from "d3";
import { Hintable } from "./hintable";
import { Renderable } from "./renderable";
export interface Player extends Renderable, Hintable {
    fps: number;
    sec: number;
    cFrame: number;
    interval: Timer;
    totalFrames: number;
    drawFrame(frame: number): void;
    drawNextFrame(): void;
    play(): void;
}
