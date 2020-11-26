import { DSVRowArray } from "d3-dsv";
import { LoadCsvFunc } from "../options/load-csv-func";
export interface Chart {
    data: DSVRowArray<string>;
    meta: DSVRowArray<string>;
    loadData: LoadCsvFunc;
    loadMeta: LoadCsvFunc;
}
//# sourceMappingURL=chart-interface.d.ts.map