import * as d3 from "d3";
import { Ani } from "./ani/Ani";
import { CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
export declare class Stage {
    aniRoot: Ani;
    compRoot: Component;
    renderer: CanvasRenderer;
    options: {
        sec: number;
        fps: number;
    };
    interval: d3.Timer;
    output: boolean;
    mode: string;
    private cFrame;
    setFrame(val: number): void;
    get totalFrames(): number;
    get canvas(): HTMLCanvasElement;
    constructor(canvas?: HTMLCanvasElement);
    addChild(child: Ani | Component): void;
    private preRender;
    render(sec: number): void;
    loadRecourse(): Promise<any[]>;
    play(): void;
    setup(): void;
    private setupChildren;
}
