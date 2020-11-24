import { ColorPicker } from "../base/color-picker";
import { ComponentManager } from "../base/component-manager";
import { Hinter } from "../base/hint";
import { Renderer } from "../base/renderer";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
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
