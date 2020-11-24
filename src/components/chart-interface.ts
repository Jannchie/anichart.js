import { DSVRowArray } from "d3-dsv";
import { LoadCsvFunc } from "../options/load-csv-func";

export interface ChartInterface {
  data: DSVRowArray<string>;
  meta: DSVRowArray<string>;
  loadData: LoadCsvFunc;
  loadMeta: LoadCsvFunc;
}
