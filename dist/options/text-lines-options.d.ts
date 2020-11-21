import { BaseOptions } from "./base-options";
export interface TextLinesOptions extends BaseOptions {
    alpha?: number | Function;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
    fontSize?: number;
    lineHeight?: number;
}
