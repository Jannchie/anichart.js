import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
interface TextComponentOptions {
    anichart?: Ani;
    text?: string;
    time?: number;
    last?: number;
    fade?: number;
    pos?: Position;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: string;
}
declare class TextComponent implements Component {
    private scale;
    private ani;
    font: string;
    text: string;
    pos: Position;
    fillStyle: string | CanvasGradient | CanvasPattern;
    constructor(options: TextComponentOptions);
    reset(options: TextComponentOptions): void;
    draw(n: number, pos?: Position): void;
}
export { TextComponent, TextComponentOptions };
