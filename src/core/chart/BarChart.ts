import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { Image } from "../component/Image";
import { Rect } from "../component/Rect";
import { Text } from "../component/Text";
import { recourse } from "../Recourse";
import * as d3 from "d3";
import * as _ from "lodash-es";
import { colorPicker } from "../ColorPicker";
import { canvasHelper } from "../CanvasHelper";
import { ScaleLinear } from "d3";
interface BarOptions {
  name: string;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
  image?: string;
}

interface BarChartOptions {
  time?: number[];
  itemCount?: number;
  idField?: string;
  colorField?: string;
  dateField?: string;
  valueField?: string;
  valueKeys?: string[];
  shape?: { width: number; height: number };
  margin?: { left: number; top: number; bottom: number; right: number };
  barPadding?: number;
  barGap?: number;
  valueFormat?: (val: number) => string;
}
export class BarChart extends Ani {
  data: any[];
  dataScales: Map<string, any>;

  time = [0, 3];
  itemCount = 10;
  idField = "id";
  colorField = "id";
  dateField = "date";
  valueField = "value";
  valueKeys = ["value"];
  shape = { width: 400, height: 300 };
  margin = { left: 20, top: 20, right: 20, bottom: 20 };
  barPadding = 8;
  barGap = 6;
  valueFormat = (val: number) => {
    return d3.format(",.0f")(val);
  };
  constructor(options?: BarChartOptions) {
    super();
    if (!options) return;
    if (options.time) this.time = options.time;
    if (options.shape) this.shape = options.shape;
    if (options.idField) this.idField = options.idField;
    if (options.dateField) this.dateField = options.dateField;
    if (options.valueField) this.valueField = options.valueField;
    if (options.itemCount) this.itemCount = options.itemCount;
    if (options.barPadding) this.barPadding = options.barPadding;
    if (options.margin) this.margin = options.margin;
    if (options.barGap) this.barGap = options.barGap;
    if (options.valueFormat) this.valueFormat = options.valueFormat;
  }
  setup() {
    this.getData();
    this.getDataScales();
    this.margin.left += this.maxLabelWidth;
    this.margin.left += this.barPadding;
    this.margin.right += this.maxValueLabelWidth;
  }

  private get maxValueLabelWidth() {
    const d = [...this.data.values()];
    const maxLabelWidth = d3.max(d, (item) => {
      const text = new Text(
        this.getLabelTextOptions(item.value, "#FFF", this.barHeight * 0.8)
      );
      const result = canvasHelper.measure(text);
      return result.width;
    });
    return maxLabelWidth;
  }
  private get maxLabelWidth() {
    const ids = [...this.dataScales.keys()];
    const maxLabelWidth = d3.max(ids, (txt) => {
      const text = new Text(
        this.getLabelTextOptions(txt, "#FFF", this.barHeight * 0.8)
      );
      const result = canvasHelper.measure(text);
      return result.width;
    });
    return maxLabelWidth;
  }

  getComponent(sec: number) {
    const currentData = this.getCurrentData(sec);
    const [min, max] = d3.extent(currentData, (d) => d[this.valueField]);
    const scaleX = d3.scaleLinear(
      [0, max],
      [
        this.margin.left,
        this.shape.width - this.margin.left - this.margin.right,
      ]
    );

    const res = new Component();
    currentData.forEach((data, index) => {
      res.children.push(
        this.getBarComponent(this.getBarOptions(data, index, scaleX))
      );
    });
    res.children.push(
      this.getBarComponent({
        name: "jannchie",
        value: sec,
        pos: { x: 200, y: 200 },
        shape: { width: sec * 100, height: 30 },
        color: "#fff",
        image: "jannchie",
        radius: 4,
      })
    );
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
    d: any,
    i: number,
    scaleX: d3.ScaleLinear<number, number, never>
  ): BarOptions {
    return {
      name: d[this.idField],
      pos: {
        x: this.margin.left,
        y: this.margin.top + i * (this.barHeight + this.barGap),
      },
      value: d[this.valueField],
      shape: { width: scaleX(d[this.valueField]), height: this.barHeight },
      color: colorPicker.getColor(d[this.colorField]),
      radius: 4,
    };
  }

  private getCurrentData(sec: number) {
    const currentData = [...this.dataScales.values()]
      .map((scale) => {
        return scale(sec);
      })
      .filter((d) => !Number.isNaN(d[this.valueField]))
      .sort((a, b) => b[this.valueField] - a[this.valueField])
      .slice(0, 21);
    return currentData;
  }

  private getBarComponent(options: BarOptions) {
    const res = new Component({
      position: options.pos,
    });
    const bar = new Rect({
      shape: options.shape,
      fillStyle: options.color,
      radius: options.radius,
      clip: true,
    });
    const label = new Text(
      this.getLabelTextOptions(
        options.name,
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
      text: `${options.name}`,
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

  private getData() {
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

  private getDataScales() {
    const dateExtent = d3.extent(this.data, (d) => d[this.dateField]);
    const secToDate = d3.scaleLinear(this.time, dateExtent);
    const g = d3.group(this.data, (d) => d[this.idField]);
    const dataScales = new Map();
    g.forEach((dataList, k) => {
      const dateList = dataList.map((d) => d[this.dateField]);
      const secList = dateList.map((d) => secToDate.invert(d));
      const dataScale = d3.scaleLinear(secList, dataList);
      dataScales.set(k, dataScale);
    });
    this.dataScales = dataScales;
  }
}
