import { ColorPicker } from "../base/color-picker";
export declare class DefaultColorPicker implements ColorPicker {
    private colorIndex;
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getColor(key: string): string;
    getNewColor(): string;
}
