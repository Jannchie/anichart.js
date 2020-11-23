import { BaseOptions } from "./base-options";
import { FontOptions } from "./font-options";
export interface TextLinesOptions extends BaseOptions {
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: FontOptions;
    lineSpacing?: number;
}
