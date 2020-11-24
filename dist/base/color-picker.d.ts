export interface ColorPicker {
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getNewColor(): string;
    getColor(key: string): string;
}
