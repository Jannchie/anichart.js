import { BaseOptions } from "./base-options";
export interface TextLinesOptions extends BaseOptions {
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
    fontSize?: number;
    lineSpacing?: number;
}
