import Ani from "../charts/ani";
import Position from "../utils/position";
export interface TextOptions {
    ani?: Ani;
    text?: string;
    time?: number;
    last?: number;
    fade?: number;
    pos?: Position | Function;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
}
