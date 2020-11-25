export declare type FontWeight = "normal" | "bold" | "bolder" | "lighter" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export declare type FontVariant = "normal" | "small-caps";
export declare type FontStyle = "normal" | "italic" | "oblique";
export interface FontOptions {
    font?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    fontVariant?: FontVariant;
}
export declare class DefaultFontOptions implements FontOptions {
    font: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    fontWeight: FontWeight;
    fontVariant: FontVariant;
    fontStyle: FontStyle;
}
export interface Fontable {
    font: FontOptions;
}
