import * as d3 from "d3";
import { DefaultFontOptions } from "../options/font-options";
import { GroupComponent } from "./group";
export declare class Axis extends GroupComponent {
    scales: {
        x: d3.ScaleLinear<number, number, never>;
        y: d3.ScaleLinear<number, number, never>;
    };
    private tickAlpha;
    tickFadeThreshold: number;
    timeFormat: string;
    valueFormat: string;
    labelFont: DefaultFontOptions;
    data: any[];
    xScaleY: number;
    yScaleX: number;
    constructor();
    update(): void;
    render(): void;
}
