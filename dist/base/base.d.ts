import { Hintable } from "./hint";
import { Component } from "../components";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable } from "./color";
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
