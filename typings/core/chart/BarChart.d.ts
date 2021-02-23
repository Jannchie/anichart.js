import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGenerate } from "./BaseChart";
interface BarChartOptions extends BaseChartOptions {
    itemCount?: number;
    barPadding?: number;
    barGap?: number;
    barInfoFormat?: KeyGenerate;
    dateLabelSize?: number;
    showDateLabel?: boolean;
}
export declare class BarChart extends BaseChart {
    constructor(options?: BarChartOptions);
    itemCount: number;
    barPadding: number;
    barGap: number;
    swap: number;
    lastValue: Map<string, number>;
    labelPlaceholder: number;
    valuePlaceholder: number;
    dateLabelSize: number;
    showDateLabel: boolean;
    get sampling(): number;
    barInfoFormat: (id: any, data?: Map<string, any> | undefined, meta?: Map<string, any> | undefined) => string;
    historyIndex: Map<any, any>;
    IDList: string[];
    setup(stage: Stage): void;
    private setShowingIDList;
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
