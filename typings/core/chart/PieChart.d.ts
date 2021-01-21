import { BaseChartOptions, BaseChart } from "./BaseChart";
import { Component } from "../component/Component";
interface PieChartOptions extends BaseChartOptions {
    radius?: [number, number];
    cornerRadius?: number;
    padAngle?: number;
}
export declare class PieChart extends BaseChart implements PieChartOptions {
    radius: [number, number];
    cornerRadius: number;
    padAngle: number;
    keyDurationSec: number;
    constructor(options?: PieChartOptions);
    getComponent(sec: number): Component;
    private getPieComponent;
}
export {};
