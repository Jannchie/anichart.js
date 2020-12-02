import * as d3 from "d3";
import { BaseScene } from "../base/BaseScene";
import { Hinter } from "../interface/Hinter";
import { Player } from "../interface/player";
import { Renderer } from "../interface/Renderer";
export declare class DefaultPlayer implements Player {
    fps: number;
    sec: number;
    scene: BaseScene;
    renderer: Renderer;
    hinter: Hinter;
    constructor(scene: BaseScene);
    cFrame: number;
    get totalFrames(): number;
    timer: d3.Timer;
    output: boolean;
    drawFrame(frame: number): void;
    drawNextFrame(): void;
    play(): void;
}
