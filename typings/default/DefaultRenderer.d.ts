import { BaseScene } from "../base/BaseScene";
import { Hinter, Renderer } from "../interface";
import { ColorPicker } from "../interface/color-picker";
import { Shape } from "../types/shape";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
export declare class DefaultRenderer implements Renderer {
    get hinter(): Hinter;
    set hinter(value: Hinter);
    scene: BaseScene;
    get componentManager(): import("./DefaultComponentManager").DefaultComponentManager;
    set componentManager(val: import("./DefaultComponentManager").DefaultComponentManager);
    shape: Shape;
    get width(): number;
    set width(value: number);
    get height(): number;
    set height(value: number);
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    colorPicker: ColorPicker;
    constructor(scene: BaseScene);
    draw(): void;
    setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
    private initCanvas;
}
