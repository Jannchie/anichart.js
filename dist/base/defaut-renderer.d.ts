import { Hinter } from "./hint";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { ColorPicker } from "./color";
import { Renderer, ComponentManager } from "./base";
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
