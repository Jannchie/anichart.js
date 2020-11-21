import Ani from "../charts/ani";
import Position from "../utils/position";
export interface RiseTextOptions {
    ani?: Ani;
    text?: string;
    time?: number;
    last?: number;
    fade?: number;
    offset?: number;
    reverse?: boolean;
    pos?: Position;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
}
