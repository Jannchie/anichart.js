import * as d3 from "d3";
import { DSVRowArray } from "d3";
import { Axis } from "../components/Axis";
import { ChartComponent } from "../components/ChartComponent";
import { LineChartOptions } from "../options/LineChartOptions";
import { DefaultFontOptions } from "../options/FontOptions";
export declare class LineChart extends ChartComponent {
    shape: {
        width: number;
        height: number;
    };
    scales: {
        x: d3.ScaleLinear<number, number, never>;
        y: d3.ScaleLinear<number, number, never>;
    };
    dataGroup: Map<any, any[]>;
    lineGen: d3.Line<[number, number]>;
    areaGen: d3.Area<[number, number]>;
    padding: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    margin: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    data: DSVRowArray<string>;
    tsRange: [number, number];
    dtRange: [number, number];
    showTime: [number, number];
    lineWidth: number;
    pointR: number;
    labelFont: DefaultFontOptions;
    timeFormat: string;
    valueFormat: string;
    days: number;
    tickFadeThreshold: number;
    private xMax;
    strict: boolean;
    collide: boolean;
    axis: Axis;
    lines: any[];
    getLabel(k: string, y: number): string;
    constructor(options?: LineChartOptions);
    setOptions(o?: LineChartOptions): void;
    update(): void;
    private calLabelMaxLength;
    private calData;
    private initData;
    private setLine;
    private setDataGroup;
    private setScale;
    private get yBottom();
    private get yTop();
    private get xRight();
    private get xLeft();
    preRender(): void;
    render(): void;
    private findY;
}
