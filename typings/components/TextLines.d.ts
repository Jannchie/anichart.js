import { Fontable } from "../options/FontOptions";
import { TextLinesOptions } from "../options/TextLinesOptions";
import { GroupComponent } from "./Group";
import { Text } from "./Text";
export declare class TextLines extends GroupComponent implements Fontable {
    components: Text[];
    lineSpacing: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    constructor(options: TextLinesOptions);
    update(): void;
}
