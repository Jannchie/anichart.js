import { BaseOptions } from "./base-options";
export interface TextLinesOptions extends BaseOptions {
    text?: string | Function;
    alpha?: number | Function;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
    lineHeight?: number;
}
