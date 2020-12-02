import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable } from "./colorable";
import { Combinable } from "./combinable";
import { Shape } from "../types/shape";
import { Hintable } from "./hintable";
export interface Renderer extends Colorable, Combinable, Hintable {
    shape: Shape;
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    draw(): void;
    setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}
