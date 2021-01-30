import * as d3 from "d3";
import * as _ from "lodash-es";
import { Ani } from "../ani/Ani";
import { canvasHelper } from "../CanvasHelper";
import { Component } from "../component/Component";
import { Text } from "../component/Text";
import { recourse } from "../Recourse";
import { Stage } from "../Stage";
export interface BaseChartOptions {
  aniTime?: [number, number];
  fadeTime?: [number, number];
  freezeTime?: [number, number];

  position?: { x: number; y: number };

  shape?: { width: number; height: number };
  margin?: { left: number; top: number; bottom: number; right: number };

  idField?: string;
  colorField?: string | KeyGenerate;
  imageField?: string | KeyGenerate;
  dateField?: string;
  valueField?: string;

  valueKeys?: string[];

  valueFormat?: (cData: any) => string;
  labelFormat?: (
    id: string,
    meta: Map<string, any>,
    data: Map<string, any>
  ) => string;
  dateFormat?: string;

  dataName?: string;
  metaName?: string;
}
export type KeyGenerate =
  | ((id: string) => string)
  | ((id: string, meta: Map<string, any>) => string)
  | ((id: string, meta: Map<string, any>, data: Map<string, any>) => string);
export abstract class BaseChart extends Ani {
  yAxisWidth: number;
  xAxisHeight: number;
  yAxisPadding: number = 4;
  xAxisPadding: number = 4;
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
    if (options.imageField) this.imageField = options.imageField;
    if (options.margin !== undefined) this.margin = options.margin;
    if (options.shape) this.shape = options.shape;
    if (options.dateFormat) this.dateFormat = options.dateFormat;
    if (options.labelFormat) this.labelFormat = options.labelFormat;
    if (options.valueFormat) this.valueFormat = options.valueFormat;
    if (options.dataName) this.dataName = options.dataName;
    if (options.metaName) this.metaName = options.metaName;
    if (options.position) this.position = options.position;
  }
  tickKeyFrameDuration: number = 1;
  dataScales: Map<string, any>;
  idField = "id";
  colorField: string | KeyGenerate = "id";
  imageField: string | KeyGenerate = "id";
  dateField = "date";
  valueField = "value";
  valueKeys = ["value"];
  imageKey = "image";
  shape: { width: number; height: number };
  position = { x: 0, y: 0 };
  margin = { left: 20, top: 20, right: 20, bottom: 20 };
  aniTime: [number, number];
  freezeTime: [number, number] = [2, 2];
  fadeTime: [number, number] = [0.5, 0];
  data: any[];
  dataGroup: Map<string, any>;
  meta: Map<string, any>;

  dataName = "data";
  metaName = "meta";

  alphaScale: d3.ScaleLinear<number, number, never>;
  secToDate: d3.ScaleLinear<any, any, never>;
  dateFormat = "%Y-%m-%d";

  xTickFormat = d3.format(",d");
  yTickFormat = d3.format(",d");

  valueMax: number;
  valueMin: number;
  historyMax: number;
  historyMin: number;

  setup(stage: Stage) {
    super.setup(stage);
    this.setData();
    this.setMeta();
    this.setDefaultAniTime(stage);
    this.setDataScales();
    this.setAlphaScale();
    // 初始化历史最值
    this.historyMax = d3.min(this.data, (d) => d[this.valueField]);
    this.historyMin = d3.max(this.data, (d) => d[this.valueField]);
    // 用于计算坐标
    this.valueMax = this.historyMin;
    this.valueMin = this.historyMax;

    if (!this.shape) {
      this.shape = {
        width: this.stage.canvas.width,
        height: this.stage.canvas.height,
      };
    }
  }
  private setData() {
    this.data = _.cloneDeep(recourse.data.get(this.dataName));
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
            if (this.valueKeys.includes(k) || this.valueField === k) {
              d[k] = +d[k].replace(/,/g, "");
            }
        }
      });
    });
    this.dataGroup = d3.group(this.data, (d) => d[this.idField]);
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

  getComponent(sec: number) {
    const res = new Component({
      position: this.position,
      alpha: this.alphaScale(sec - this.fadeTime[0] - this.freezeTime[0]),
    });
    return res;
  }

  setMeta() {
    if (recourse.data.get(this.metaName)) {
      this.meta = d3.rollup(
        _.cloneDeep(recourse.data.get(this.metaName)),
        (v) => v[0],
        (d) => d[this.idField]
      );
    }
  }
  valueFormat = (cData: any) => {
    return d3.format(",.0f")(cData[this.valueField]);
  };

  labelFormat: KeyGenerate = (id: string, meta?: Map<string, any>) => {
    if (meta && meta.get(id) && meta.get(id).name) {
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
  getCurrentData(sec: number, filter = true) {
    let currentData = [...this.dataScales.values()];
    currentData = currentData.map((scale) => {
      return scale(sec);
    });
    if (filter) {
      currentData = currentData.filter((d) => d !== undefined);
    }
    currentData = currentData.sort((a, b) => {
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

  protected getScalesBySec(sec: number) {
    const currentData = this.getCurrentData(sec);
    const valueRange = d3.extent(currentData, (d) => d[this.valueField]);
    if (this.historyMax > valueRange[1]) {
      valueRange[1] = this.historyMax;
    }
    if (this.historyMin < valueRange[0]) {
      valueRange[0] = this.historyMin;
    }
    const trueSec =
      sec < this.aniTime[0]
        ? this.aniTime[0]
        : sec > this.aniTime[1]
        ? this.aniTime[1]
        : sec;
    const scales = {
      x: d3.scaleLinear(
        [this.aniTime[0], trueSec],
        [0, this.shape.width - this.margin.left - this.margin.right]
      ),
      y: d3.scaleLinear(valueRange, [
        this.shape.height - this.margin.top - this.margin.bottom,
        0,
      ]),
    };
    return scales;
  }

  protected getAxis(sec: number, scales: { x: any; y: any }) {
    const tickComp = new Text({
      text: `${this.yTickFormat(this.valueMax)}`,
      font: "Sarasa Mono SC",
      fillStyle: "#777",
      fontSize: 30,
    });
    const tickKeySec = this.tickKeySecRange(sec);
    const tickScales = tickKeySec.map((s) => {
      return this.getScalesBySec(s);
    });
    this.yAxisWidth = canvasHelper.measure(tickComp).width;
    this.xAxisHeight = tickComp.fontSize;
    const yAxis = this.getAxisComponent(
      this.yTickFormat,
      tickScales[0].y,
      tickScales[1].y,
      this.margin.left + this.yAxisWidth,
      5,
      tickComp,
      "y",
      sec,
      tickKeySec,
      scales.y
    );
    const xAxis = this.getAxisComponent(
      this.xTickFormat,
      tickScales[0].x,
      tickScales[1].x,
      this.margin.top + this.xAxisHeight,
      5,
      tickComp,
      "x",
      sec,
      tickKeySec,
      scales.x
    );
    return { yAxis, xAxis };
  }

  protected getAxisComponent(
    format: (v: number | { valueOf(): number }) => string,
    scale0: d3.ScaleLinear<number, number, never>,
    scale1: d3.ScaleLinear<number, number, never>,
    pos: number,
    count: number,
    text: Text,
    type: "x" | "y",
    sec: number,
    secRange: [number, number],
    scale: d3.ScaleLinear<number, number, never>
  ) {
    const alpha = (sec - secRange[0]) / (secRange[1] - secRange[0]);
    const ticks0 = scale0.ticks(count);
    const ticks1 = scale1.ticks(count);
    const ticks: { v: number; a: number; init: number }[] = [
      ...ticks0.map((t) => {
        if (ticks1.find((d) => d === t)) {
          return { v: t, a: 1, init: 0 };
        } else {
          return { v: t, a: 1 - alpha, init: 0 };
        }
      }),
    ];

    ticks1.forEach((tickVal) => {
      const tick = ticks.find((d) => d.v === tickVal);
      if (tick) {
        tick.a = 1;
      } else {
        ticks.push({ v: tickVal, a: alpha, init: 1 });
      }
    });
    const res = new Component({
      position: {
        x: this.margin.left + this.yAxisWidth + this.yAxisPadding,
        y: this.margin.top + this.xAxisHeight + this.xAxisPadding,
      },
    });
    res.children = ticks.map((tick) => {
      const t = new Text(text);
      if (type === "y") {
        t.position = { y: scale(tick.v), x: -this.yAxisPadding };
        t.textAlign = "right";
        t.textBaseline = "middle";
      } else {
        t.position = { x: scale(tick.v), y: -this.xAxisPadding };
        t.textBaseline = "bottom";
        t.textAlign = "center";
      }
      // t.children.push(
      //   new Rect({
      //     shape: { width: 10, height: 1 },
      //     fillStyle: "#Fff",
      //   })
      // );
      t.text = format(tick.v);
      t.alpha = tick.a;
      return t;
    });
    return res;
  }
  protected tickKeySecRange(sec: number): [number, number] {
    const remained = sec % this.tickKeyFrameDuration;
    const start = sec - remained;
    const end = start + this.tickKeyFrameDuration;
    return [start, end];
  }
}
