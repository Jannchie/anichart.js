import { Base } from ".";
import Ani from "../charts/ani";
import Position from "../utils/position";
import { TextOptions } from "./text-options";
declare class Text extends Base {
    ani: Ani;
    alpha: number | Function;
    font: string;
    text: string | Function;
    pos: Position | Function;
    fillStyle: string | CanvasGradient | CanvasPattern;
    constructor(options: TextOptions);
    render(n: number): void;
}
export { Text, TextOptions };
