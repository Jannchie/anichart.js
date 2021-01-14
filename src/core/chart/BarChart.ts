import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { Image } from "../component/Image";
import { Rect } from "../component/Rect";
import { Text } from "../component/Text";
import * as d3 from "d3";
import * as _ from "lodash-es";
import { colorPicker } from "../ColorPicker";
import { canvasHelper } from "../CanvasHelper";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions, KeyGener } from "./BaseChart";
interface BarOptions {
  id: string;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
  alpha: number;
  image?: string;
}

interface BarChartOptions extends BaseChartOptions {
  itemCount?: number;
  barPadding?: number;
  barGap?: number;
  barInfoFormat?: KeyGener;
}
export class BarChart extends BaseChart {
  itemCount = 20;

  barPadding = 8;
  barGap = 8;
  swap = 0.25;
  lastValue = new Map<string, number>();
  labelPlaceholder: number;
  valuePlaceholder: number;

  get sampling() {
    if (this.stage) {
      return Math.round(this.stage.options.fps * this.swap);
    } else {
      return Math.round(30 * this.swap);
    }
  }

  barInfoFormat = (
    id: any,
    data?: Map<string, any>,
    meta?: Map<string, any>
  ) => {
    return this.labelFormat(id, data, meta);
  };

  historyIndex: Map<any, any>;
  ids: string[];
  constructor(options?: BarChartOptions) {
    super(options);
    if (!options) return;
    if (options.itemCount) this.itemCount = options.itemCount;
    if (options.barPadding !== undefined) this.barPadding = options.barPadding;
    if (options.barGap !== undefined) this.barGap = options.barGap;
  }
  setup(stage: Stage) {
    super.setup(stage);
    this.ids = [...this.dataScales.keys()];
    this.labelPlaceholder = this.maxLabelWidth;
    this.valuePlaceholder = this.maxValueLabelWidth;
    this.setHistoryIndex();
  }

  private setHistoryIndex() {
    const range = d3.range(
      this.aniTime[0] - this.swap,
      this.aniTime[0],
      this.swap / this.sampling
    );
    const datas = range.map((t) =>
      this.getCurrentData(t).map((v) => v[this.idField])
    );
    this.historyIndex = this.ids.reduce((d, id) => {
      const indexList = [];
      for (const dataList of datas) {
        let index = dataList.indexOf(id);
        if (index === -1) index = this.itemCount;
        indexList.push(index);
      }
      d.set(id, indexList);
      return d;
    }, new Map());
  }

  private get maxValueLabelWidth() {
    const d = [...this.data.values()];
    const maxWidth = d3.max(d, (item) => {
      const text = new Text(
        this.getLabelTextOptions(
          this.valueFormat(item.value),
          "#FFF",
          this.barHeight * 0.8
        )
      );
      const result = canvasHelper.measure(text);
      return result.width;
    });
    return maxWidth;
  }
  private get maxLabelWidth() {
    const maxWidth = d3.max(this.ids, (id) => {
      const text = new Text(
        this.getLabelTextOptions(
          this.labelFormat(id, this.meta, this.dataGroup),
          "#FFF",
          this.barHeight * 0.8
        )
      );
      const result = canvasHelper.measure(text);
      return result.width;
    });
    return maxWidth;
  }

  getComponent(sec: number) {
    const currentData = this.getCurrentData(sec);
    currentData.forEach((d, i) => {
      const index = Number.isNaN(d[this.valueField]) ? this.itemCount : i;
      this.historyIndex.get(d[this.idField]).push(index);
    });
    for (const history of this.historyIndex.values()) {
      const len = history.length;
      if (len === this.sampling) {
        history.push(this.itemCount);
      }
      history.shift();
    }
    const indexs = this.ids.reduce(
      (map, id) =>
        map.set(
          id,
          d3.mean(this.historyIndex.get(id).map((data: unknown) => data))
        ),
      new Map()
    );
    const [min, max] = d3.extent(currentData, (d) => d[this.valueField]);
    const scaleX = d3.scaleLinear(
      [0, max],
      [
        0,
        this.shape.width -
          this.margin.left -
          this.barPadding -
          this.labelPlaceholder -
          this.margin.right -
          this.valuePlaceholder,
      ]
    );

    const res = new Component({
      alpha: this.alphaScale(sec),
      position: this.position,
    });
    currentData.forEach((data) => {
      const barOptions = this.getBarOptions(data, scaleX, indexs, sec);
      if (barOptions.alpha > 0) {
        res.children.push(this.getBarComponent(barOptions));
      }
    });

    const dateLabel = new Text({
      text: d3.timeFormat(this.dateFormat)(this.secToDate(sec)),
      font: "Sarasa Mono Slab SC",
      fontSize: 45,
      fillStyle: "#777",
      textAlign: "right",
      fontWeight: "bolder",
      textBaseline: "bottom",
      position: {
        x: this.shape.width - this.margin.right,
        y: this.shape.height - this.margin.bottom,
      },
    });
    res.children.push(dateLabel);
    return res;
  }
  private get barHeight() {
    return (
      (this.shape.height -
        this.margin.top -
        this.margin.bottom -
        this.barGap * (this.itemCount - 1)) /
      this.itemCount
    );
  }

  private getBarOptions(
    data: any,
    scaleX: d3.ScaleLinear<number, number, never>,
    indexs: Map<string, number>,
    sec: number
  ): BarOptions {
    if (!Number.isNaN(data[this.valueField])) {
      this.lastValue.set(data[this.idField], data[this.valueField]);
    }
    data[this.valueField] = this.lastValue.get(data[this.idField]);
    const alpha = d3
      .scaleLinear([this.itemCount - 1, this.itemCount], [1, 0])
      .clamp(true)(indexs.get(data[this.idField]));
    let color: string;
    if (typeof this.colorField === "string") {
      color = data[this.idField];
    } else {
      color = this.colorField(data[this.idField], this.meta, this.dataGroup);
    }
    return {
      id: data[this.idField],
      pos: {
        x: this.margin.left + this.barPadding + this.labelPlaceholder,
        y:
          this.margin.top +
          indexs.get(data[this.idField]) * (this.barHeight + this.barGap),
      },
      alpha,
      value: data[this.valueField],
      shape: { width: scaleX(data[this.valueField]), height: this.barHeight },
      color: colorPicker.getColor(color),
      radius: 4,
    };
  }

  private getBarComponent(options: BarOptions) {
    const res = new Component({
      position: options.pos,
      alpha: options.alpha,
    });
    const bar = new Rect({
      shape: options.shape,
      fillStyle: options.color,
      radius: options.radius,
      clip: true,
    });
    const label = new Text(
      this.getLabelTextOptions(
        this.labelFormat(options.id, this.meta, this.dataGroup),
        options.color,
        options.shape.height * 0.8
      )
    );
    const valueLabel = new Text({
      textBaseline: "bottom",
      text: `${this.valueFormat(options.value)}`,
      // textAlign: "left",
      position: {
        x: options.shape.width + this.barPadding,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fillStyle: options.color,
    });
    const imagePlaceholder = options.image ? options.shape.height : 0;
    const barInfo = new Text({
      textAlign: "right",
      textBaseline: "bottom",
      text: this.barInfoFormat(options.id, this.meta),
      position: {
        x: options.shape.width - this.barPadding - imagePlaceholder,
        y: options.shape.height,
      },
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      fontWeight: "bolder",
      fillStyle: "#1e1e1e",
    });
    if (options.image) {
      const img = new Image({
        path: options.image,
        position: {
          x: options.shape.width - options.shape.height,
          y: 0,
        },
        shape: {
          width: options.shape.height,
          height: options.shape.height,
        },
      });
      bar.children.push(img);
    }
    bar.children.push(barInfo);
    res.children.push(bar);
    res.children.push(valueLabel);
    res.children.push(label);
    return res as Component;
  }

  private getLabelTextOptions(
    text: string,
    color = "#fff",
    fontSize: number = 16
  ): Text {
    return {
      text: `${text}`,
      textAlign: "right",
      textBaseline: "bottom",
      fontSize,
      font: "Sarasa Mono SC",
      position: { x: 0 - this.barPadding, y: fontSize / 0.8 },
      fillStyle: color,
    };
  }
}
