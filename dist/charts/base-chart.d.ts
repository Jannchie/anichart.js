import Ani from "./ani";
import { Component } from "../components/index";
declare class BaseChart implements Ani {
    fps: number;
    sec: number;
    totalFrames: number;
    components: Component[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor(options?: object);
    output: boolean;
    ready(): void;
    play(): void;
    draw(frame: number): void;
    setOptions(options: object): void;
    calOptions(): void;
    setCanvas(selector: string): void;
    selectCanvas(selector?: string): void;
    initCanvas(parent?: string): void;
    preRender(): void;
    drawFrame(n: number): void;
}
export { BaseChart };
