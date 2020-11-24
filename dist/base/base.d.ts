import { Hintable, Hinter } from "./hint";
import { Timer } from "d3";
import { Component } from "../components";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable, ColorPicker } from "./color";
export declare type Shape = {
    width: number;
    height: number;
};
export interface ComponentManager {
    components: Component[];
    addComponent(c: Component): void;
}
export declare class DefaultComponentManager implements ComponentManager {
    components: Component[];
    addComponent(c: Component): void;
}
export interface Combinable {
    componentManager: ComponentManager;
}
export interface Renderer extends Colorable, Combinable, Hintable {
    shape: Shape;
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    draw(): void;
    setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}
export interface Renderable {
    renderer: Renderer;
}
export declare class DefaultRenderer implements Renderer {
    hinter: Hinter;
    componentManager: ComponentManager;
    shape: {
        width: number;
        height: number;
    };
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    colorPicker: ColorPicker;
    constructor(hinter: Hinter, componentManager?: ComponentManager);
    draw(): void;
    setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
    private initCanvas;
}
export interface Player extends Renderable, Hintable {
    fps: number;
    sec: number;
    cFrame: number;
    totalFrames: number;
    timer: Timer;
    drawFrame(frame: number): void;
    play(): void;
}
export interface Playable {
    player: Player;
}
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
