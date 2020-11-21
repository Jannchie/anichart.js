import { Base } from ".";
import { TextOptions } from "../options/text-options";
declare class Text extends Base {
    font: string;
    fontSize: number;
    text: string | Function;
    fillStyle: string | CanvasGradient | CanvasPattern;
    protected _text: string;
    constructor(options: TextOptions);
    preRender(n: number): void;
    render(n: number): void;
}
export { Text };
