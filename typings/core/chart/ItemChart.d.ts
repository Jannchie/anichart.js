import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface ItemChartOptions extends BaseChartOptions {
    style?: string;
}
export declare class ItemChart extends BaseChart {
    constructor(options: ItemChartOptions);
    setup(stage: Stage): void;
    getComponent(sec: number): Component;
}
export {};
