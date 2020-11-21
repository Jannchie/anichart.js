import { Base } from ".";
import { TextOptions } from "../options/text-options";
import { Position } from "../utils/position";
declare class Text extends Base {
    font: string;
    fontSize: number;
    text: string | Function;
    fillStyle: string | CanvasGradient | CanvasPattern;
    offset: Position | Function;
    _text: string;
    protected _offset: Position;
    constructor(options: TextOptions);
    preRender(n: number): void;
    render(n: number): void;
}
export { Text };
