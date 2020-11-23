import { FontOptions } from "./../options/font-options";
import { Base } from ".";
import { TextOptions } from "../options/text-options";
import { Pos } from "../utils/position";
declare class Text extends Base {
    text: string | Function;
    fillStyle: string | CanvasGradient | CanvasPattern;
    offset: Pos | Function;
    _text: string;
    font: FontOptions;
    protected cOffset: Pos;
    private finalFont;
    constructor(options: TextOptions);
    reset(options?: TextOptions): void;
    preRender(n: number): void;
    render(n: number): void;
}
export { Text };
