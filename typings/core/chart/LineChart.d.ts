import * as d3 from "d3";
import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface LineChartOptions extends BaseChartOptions {
    pointerR?: number;
}
export declare class LineChart extends BaseChart {
    pointerR: number;
    labelPlaceholder: number;
    labelSize: number;
    labelPadding: number;
    topN: number;
    constructor(options: LineChartOptions);
    scales: {
        x: d3.ScaleLinear<number, number, never>;
        y: d3.ScaleLinear<number, number, never>;
    };
    setup(stage: Stage): void;
    getComponent(sec: number): Component | null;
    protected getScalesBySec(sec: number): {
        x: d3.ScaleLinear<number, number, never>;
        y: d3.ScaleLinear<number, number, never>;
    };
    private findY;
}
export {};
