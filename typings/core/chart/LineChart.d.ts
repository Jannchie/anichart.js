import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
import { ScaleLinear } from "d3";
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
        x: ScaleLinear<number, number, never>;
        y: ScaleLinear<number, number, never>;
    };
    setup(stage: Stage): void;
    getComponent(sec: number): Component | null;
    protected getScalesBySec(sec: number): {
        x: ScaleLinear<number, number, never>;
        y: ScaleLinear<number, number, never>;
    };
    private findY;
}
export {};
