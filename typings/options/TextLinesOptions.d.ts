import { BaseOptions } from "./BaseOptions";
import { FontOptions } from "./FontOptions";
export interface TextLinesOptions extends BaseOptions {
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: FontOptions;
    lineSpacing?: number;
}
