import { BaseChartOptions, BaseChart } from "./BaseChart";
import { Component } from "../component/Component";
import { FontWeight } from "../component/Text";
interface PieChartOptions extends BaseChartOptions {
    radius?: [number, number];
    labelTextStyle?: {
        font: string;
        lineWidth: number;
        fontSize: number;
        fontWeight: FontWeight;
        strokeStyle: string;
    };
    cornerRadius?: number;
    padAngle?: number;
}
export declare class PieChart extends BaseChart implements PieChartOptions {
    radius: [number, number];
    cornerRadius: number;
    padAngle: number;
    keyDurationSec: number;
    labelTextStyle: {
        font: string;
        lineWidth: number;
        fontSize: number;
        fontWeight: FontWeight;
        strokeStyle: string;
    };
    constructor(options?: PieChartOptions);
    getComponent(sec: number): Component;
    private getPieComponent;
}
export {};
