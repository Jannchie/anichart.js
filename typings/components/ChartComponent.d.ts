import { DSVRowArray } from "d3-dsv";
import { ChartOptions } from "../options/ChartOptions";
import { Chart } from "./chart-interface";
import { GroupComponent as Group } from "./Group";
export declare abstract class ChartComponent extends Group implements Chart {
    dateKey: string;
    valueKey: string;
    idKey: string;
    colorKey: string;
    constructor(options: ChartOptions);
    setOptions(options: ChartOptions): void;
    loadData(path: string | any): Promise<void>;
    update(): void;
    private readCsv;
    loadMeta(path: string | any): Promise<void>;
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
}
