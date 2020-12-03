import { FontOptions } from "./FontOptions";
import { BaseOptions } from "./BaseOptions";
export interface TextOptions extends BaseOptions {
    text?: string | ((n: number) => string);
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: FontOptions;
}
