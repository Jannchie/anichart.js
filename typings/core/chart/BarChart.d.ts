import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface BarChartOptions extends BaseChartOptions {
    itemCount?: number;
    barPadding?: number;
    barGap?: number;
    barInfoFormat?: (id: string, meta?: Map<string, any>) => string;
}
export declare class BarChart extends BaseChart {
    itemCount: number;
    barPadding: number;
    barGap: number;
    swap: number;
    lastValue: Map<string, number>;
    labelPlaceholder: number;
    valuePlaceholder: number;
    get sampling(): number;
    barInfoFormat: (id: any, meta?: Map<string, any>) => any;
    historyIndex: Map<any, any>;
    ids: string[];
    constructor(options?: BarChartOptions);
    setup(stage: Stage): void;
    private setHistoryIndex;
    private get maxValueLabelWidth();
    private get maxLabelWidth();
    getComponent(sec: number): Component;
    private get barHeight();
    private getBarOptions;
    private getBarComponent;
    private getLabelTextOptions;
}
export {};
