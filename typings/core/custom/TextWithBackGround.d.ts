import { FontWeight, Component } from "../..";
export declare function getTextWithBackground({ txt, position, fontSize, fontWeight, textAlign, textBaseline, foregroundStyle, backgroundStyle, padding, }: {
    txt?: string;
    position?: {
        x: number;
        y: number;
    };
    fontSize?: number;
    fontWeight?: FontWeight;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    foregroundStyle?: string;
    backgroundStyle?: string;
    padding?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}): Component;
