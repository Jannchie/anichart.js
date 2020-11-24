import { Hinter } from "./hint";
import { Timer } from "d3";
import { Player } from "./player";
import { Renderer } from "./base";
export declare class DefaultPlayer implements Player {
    fps: number;
    sec: number;
    constructor(renderer: Renderer, hinter: Hinter);
    renderer: Renderer;
    hinter: Hinter;
    cFrame: number;
    get totalFrames(): number;
    timer: Timer;
    output: boolean;
    drawFrame(frame: number): void;
    play(): void;
}
