import { TextLinesOptions } from "../options/text-lines-options";
import { Group } from "./group";
import { Text } from "./Text";
export declare class TextLines extends Group {
    components: Text[];
    lineHeight: number;
    constructor(options: TextLinesOptions);
    reset(options: TextLinesOptions): void;
    preRender(n: number): void;
}
