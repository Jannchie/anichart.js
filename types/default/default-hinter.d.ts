import { ImageLoader } from "../image-loader";
import { Hinter } from "../interface/hinter";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
export declare type DrawHint = (msg: string) => void;
export declare class DefaultHinter implements Hinter {
    canvas: HTMLCanvasElement;
    imageLoader: ImageLoader;
    constructor(ctx?: EnhancedCanvasRenderingContext2D);
    hint: string;
    ctx: EnhancedCanvasRenderingContext2D;
    height: number;
    drawHint(msg: string): Promise<void>;
}
