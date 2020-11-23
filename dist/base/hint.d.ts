import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
interface DrawHint {
    (msg: string): void;
}
export interface Hinter {
    hint: string;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
    drawHint: DrawHint;
}
export declare class DefaultHinter implements Hinter {
    hint: string;
    ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
    width: number;
    height: number;
    drawHint(msg: string): void;
}
export interface Hintable {
    hinter: Hinter;
}
export {};
