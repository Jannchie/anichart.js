import { TextLinesOptions } from "../options/text-lines-options";
import { Group } from "./group";
import { Text } from "./Text";
export declare class TextLines extends Group {
    components: Text[];
    lineSpacing: number;
    fontSize: number;
    font: string;
    fillStyle: string | CanvasGradient | CanvasPattern;
    constructor(options: TextLinesOptions);
    addComponent(c: Text): void;
    reset(options: TextLinesOptions): void;
}
