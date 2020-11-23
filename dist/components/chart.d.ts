import { DSVRowArray } from "d3-dsv";
import { GroupComponent } from "./group";
interface LoadCsvFunc {
    (path: string | any): Promise<void>;
}
export interface ChartInterface {
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
    loadData: LoadCsvFunc;
    loadMeta: LoadCsvFunc;
}
export declare abstract class ChartCompoment extends GroupComponent implements ChartInterface {
    loadData(path: string | any): Promise<void>;
    private readCsv;
    loadMeta(path: string | any): Promise<void>;
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
}
export {};
