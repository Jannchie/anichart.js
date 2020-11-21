import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
import { TextOptions } from "./text-options";
declare class Text implements Component {
    private scale;
    ani: Ani;
    font: string;
    text: string;
    pos: Position;
    fillStyle: string | CanvasGradient | CanvasPattern;
    constructor(options: TextOptions);
    reset(options: TextOptions): void;
    draw(n: number, pos?: Position): void;
}
export { Text, TextOptions };
