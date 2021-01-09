import * as d3 from "d3";
import * as _ from "lodash-es";
import { Ani } from "../ani/Ani";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";

export interface BaseChartOptions {
  aniTime?: [number, number];
  fadeTime?: [number, number];
  freezeTime?: [number, number];

  shape?: { width: number; height: number };
  margin?: { left: number; top: number; bottom: number; right: number };

  idField?: string;
  colorField?: string;
  dateField?: string;
  valueField?: string;

  valueKeys?: string[];

  valueFormat?: (val: number) => string;
  labelFormat?: (id: string, meta?: Map<string, any>) => string;
  dateFormat?: string;
}

export abstract class BaseChart extends Ani {
  dataScales: Map<string, any>;
  idField = "id";
  colorField = "id";
  dateField = "date";
  valueField = "value";
  valueKeys = ["value"];
  shape = { width: 400, height: 300 };
  margin = { left: 20, top: 20, right: 20, bottom: 20 };
  aniTime: [number, number];
  freezeTime = [2, 2];
  fadeTime = [0.5, 0];
  data: any[];
  meta: Map<string, any>;
  alphaScale: d3.ScaleLinear<number, number, never>;
  secToDate: d3.ScaleLinear<any, any, never>;
  dateFormat = "%Y-%m-%d";
  constructor(options?: BaseChartOptions) {
    super();
    if (!options) return;
    if (options.fadeTime) this.fadeTime = options.fadeTime;
    if (options.aniTime) this.aniTime = options.aniTime;
    if (options.freezeTime) this.freezeTime = options.freezeTime;
    if (options.idField) this.idField = options.idField;
    if (options.colorField) this.colorField = options.colorField;
    if (options.dateField) this.dateField = options.dateField;
    if (options.valueKeys) this.valueKeys = options.valueKeys;
    if (options.valueField) this.valueField = options.valueField;
    if (options.margin !== undefined) this.margin = options.margin;
    if (options.shape) this.shape = options.shape;
    if (options.dateFormat) this.dateFormat = options.dateFormat;
  }
  setup(stage: Stage) {
    super.setup(stage);
    this.setData();
    this.setMeta();
    this.setDefaultAniTime(stage);
    this.setDataScales();
    this.setAlphaScale();
  }
  private setData() {
    this.data = _.cloneDeep(recourse.data.get("data"));
    this.data.forEach((d: any) => {
      Object.keys(d).forEach((k) => {
        switch (k) {
          case this.dateField:
            // 日期字符串转成日期
            d[k] = new Date(
              new Date().getTimezoneOffset() * 60 * 1000 +
                new Date(d[this.dateField]).getTime()
            );
            break;
          case this.idField:
            // ID保持不变
            break;
          default:
            // 数值转成数字
            if (this.valueKeys.includes(k)) {
              d[k] = +d[k];
            }
        }
      });
    });
  }
  private setDataScales() {
    const dateExtent = d3.extent(this.data, (d) => d[this.dateField]);
    this.secToDate = d3.scaleLinear(this.aniTime, dateExtent).clamp(true);
    const g = d3.group(this.data, (d) => d[this.idField]);
    const dataScales = new Map();
    g.forEach((dataList, k) => {
      const dateList = dataList.map((d) => d[this.dateField]);
      const secList = dateList.map((d) => this.secToDate.invert(d));
      const dataScale = d3.scaleLinear(secList, dataList).clamp(true);
      dataScales.set(k, dataScale);
    });
    this.dataScales = dataScales;
  }

  setMeta() {
    this.meta = d3.rollup(
      _.cloneDeep(recourse.data.get("meta")),
      (v) => v[0],
      (d) => d[this.idField]
    );
  }
  valueFormat = (val: number) => {
    return d3.format(",.0f")(val);
  };

  labelFormat = (id: string, meta?: Map<string, any>) => {
    if (meta.get(id) && meta.get(id).name) {
      return meta.get(id).name;
    } else {
      return id;
    }
  };

  private setAlphaScale() {
    this.alphaScale = d3
      .scaleLinear(
        [
          this.aniTime[0] - this.freezeTime[0] - this.fadeTime[0],
          this.aniTime[0] - this.freezeTime[0],
          this.aniTime[1] + this.freezeTime[1],
          this.aniTime[1] + this.freezeTime[1] + this.fadeTime[1],
        ],
        [this.fadeTime[0] ? 0 : 1, 1, 1, this.fadeTime[1] ? 0 : 1]
      )
      .clamp(true);
  }

  private setDefaultAniTime(stage: Stage) {
    if (this.aniTime === undefined) {
      this.aniTime = [
        0 + this.fadeTime[0] + this.freezeTime[0],
        stage.options.sec - this.freezeTime[1] - this.fadeTime[1],
      ];
    }
  }
  getCurrentData(sec: number) {
    const currentData = [...this.dataScales.values()]
      .map((scale) => {
        return scale(sec);
      })
      .filter((d) => d !== undefined)
      .sort((a, b) => {
        if (Number.isNaN(b[this.valueField])) {
          return -1;
        } else if (Number.isNaN(a[this.valueField])) {
          return 1;
        } else {
          return b[this.valueField] - a[this.valueField];
        }
      });
    return currentData;
  }
}
