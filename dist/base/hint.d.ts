import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { ImageLoader } from "./../image-loader";
declare type DrawHint = (msg: string) => void;
export interface Hinter {
    hint: string;
    ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
    drawHint: DrawHint;
}
export declare class DefaultHinter implements Hinter {
    canvas: HTMLCanvasElement;
    imageLoader: ImageLoader;
    constructor(ctx?: EnhancedCanvasRenderingContext2D);
    hint: string;
    ctx: EnhancedCanvasRenderingContext2D;
    height: number;
    drawHint(msg: string): Promise<void>;
}
export interface Hintable {
    hinter: Hinter;
}
export {};
