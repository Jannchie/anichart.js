import Position from "../utils/position";
export interface TextOptions {
    text?: string | Function;
    pos?: Position | Function;
    alpha?: number | Function;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
}
