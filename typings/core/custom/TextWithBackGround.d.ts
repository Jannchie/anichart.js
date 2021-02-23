import { Component } from "../component/Component";
export declare function getTextWithBackground({ txt, position, fontSize, fontWeight, textAlign, textBaseline, foregroundStyle, backgroundStyle, padding, }: {
    txt?: string | undefined;
    position?: {
        x: number;
        y: number;
    } | undefined;
    fontSize?: number | undefined;
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined;
    textAlign?: "center" | "end" | "left" | "right" | "start" | undefined;
    textBaseline?: "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top" | undefined;
    foregroundStyle?: string | undefined;
    backgroundStyle?: string | undefined;
    padding?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    } | undefined;
}): Component;
