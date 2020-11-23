export interface Colorable {
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getNewColor(): string;
    getColor(key: string): string;
}
export declare class ColorManager implements Colorable {
    private colorIndex;
    background: string;
    colorMap: Map<string, string>;
    colorScheme: string[];
    getColor(key: string): string;
    getNewColor(): string;
}
