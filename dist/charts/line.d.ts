import { Base } from "./../components/base";
import * as d3 from "d3";
import { LineChartOptions } from "../options/line-chart-options";
export declare class LineChart extends Base {
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
    data: any;
    tsRange: [number, number];
    dtRange: [number, number];
    showTime: [number, number];
    count: number;
    lineWidth: number;
    private xMax;
    dateKey: string;
    valueKey: string;
    idKey: string;
    colorKey: string;
    constructor(options: LineChartOptions);
    reset(options: LineChartOptions): void;
    private setLine;
    private setDataGroup;
    private setScale;
    private setRange;
    preRender(n: number): void;
    render(n: number): void;
    private findY;
}
