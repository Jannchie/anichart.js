import { DSVRowArray } from "d3-dsv";
import { Chart } from "./chart-interface";
import { Component } from "./component";
import { GroupComponent as Group } from "./group";
export declare abstract class ChartCompoment extends Group implements Chart {
    dateKey: string;
    valueKey: string;
    idKey: string;
    colorKey: string;
    components: Component[];
    loadData(path: string | any): Promise<void>;
    update(option?: any): void;
    private readCsv;
    loadMeta(path: string | any): Promise<void>;
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
}
