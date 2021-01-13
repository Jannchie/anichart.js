declare class ColorPicker {
    private colorIndex;
    private colorMap;
    colorScheme: string[];
    getColor(key: string): string;
    getNewColor(): string;
    setColor(key: string, color: string): void;
}
export declare const colorPicker: ColorPicker;
export {};
