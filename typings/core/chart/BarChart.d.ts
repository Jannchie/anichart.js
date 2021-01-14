import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGener } from "./BaseChart";
interface BarChartOptions extends BaseChartOptions {
    itemCount?: number;
    barPadding?: number;
    barGap?: number;
    barInfoFormat?: KeyGener;
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
    barInfoFormat: (id: any, data?: Map<string, any>, meta?: Map<string, any>) => string;
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
