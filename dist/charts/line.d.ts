import { DefaultFontOptions } from "./../options/font-options";
import * as d3 from "d3";
import { LineChartOptions } from "../options/line-chart-options";
import { DSVRowArray } from "d3";
import { ChartCompoment } from "../components/chart";
export declare class LineChart extends ChartCompoment {
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
    dateKey: string;
    valueKey: string;
    idKey: string;
    colorKey: string;
    pointR: number;
    labelFont: DefaultFontOptions;
    timeFormat: string;
    valueFormat: string;
    private xMax;
    getLabel(k: string, y: number): string;
    constructor(options: LineChartOptions);
    reset(options?: LineChartOptions): void;
    private setLine;
    private setDataGroup;
    private setScale;
    private setRange;
    preRender(n: number): void;
    render(n: number): void;
    private findY;
}
