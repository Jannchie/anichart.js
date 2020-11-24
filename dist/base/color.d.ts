export interface ColorPicker {
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getNewColor(): string;
    getColor(key: string): string;
}
export interface Colorable {
    colorPicker: ColorPicker;
}
export declare class DefaultColorPicker implements ColorPicker {
    private colorIndex;
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getColor(key: string): string;
    getNewColor(): string;
}
