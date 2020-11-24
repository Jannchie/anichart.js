import { DSVRowArray } from "d3-dsv";
import { ChartInterface } from "./chart-interface";
import { Component } from "./component";
import { GroupComponent } from "./group";
export declare abstract class ChartCompoment extends GroupComponent implements ChartInterface {
    components: Component[];
    loadData(path: string | any): Promise<void>;
    update(option?: any): void;
    private readCsv;
    loadMeta(path: string | any): Promise<void>;
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
}
