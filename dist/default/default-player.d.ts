import * as d3 from "d3";
import { Hinter } from "../base/hint";
import { Player } from "../base/player";
import { Renderer } from "../base/renderer";
export declare class DefaultPlayer implements Player {
    fps: number;
    sec: number;
    constructor(renderer: Renderer, hinter: Hinter);
    renderer: Renderer;
    hinter: Hinter;
    cFrame: number;
    get totalFrames(): number;
    timer: d3.Timer;
    output: boolean;
    drawFrame(frame: number): void;
    play(): void;
}
