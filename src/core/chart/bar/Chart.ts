import { Ani } from "../../ani/Ani";
import { Component } from "../../component/Component";
import { Image } from "../../component/Image";
import { Rect } from "../../component/Rect";
import { Text } from "../../component/Text";
import { recourse } from "../../Recourse";
import * as d3 from "d3";
import * as _ from "lodash-es";
interface BarOptions {
  name: string;
  value: number;
  pos: { x: number; y: number };
  shape: { width: number; height: number };
  color: string;
  radius: number;
  image?: string;
}

export class BarChart extends Ani {
  data: any[];
  dataScales: Map<string, any>;

  time = [0, 3];
  idField = "id";
  dateField = "date";
  valueField = "value";
  valueKeys = ["value"];

  constructor(options?: BarChart) {
    super();
    if (!options) return;
    if (options.time) this.time = options.time;
    if (options.idField) this.idField = options.idField;
    if (options.dateField) this.dateField = options.dateField;
    if (options.valueField) this.valueField = options.valueField;
  }
  setup() {
    this.getData();
    this.getDataScales();
  }

  getComponent(sec: number) {
    const currentData = this.getCurrentData(sec);
    const res = new Component();
    currentData.forEach((d, i) => {
      res.children.push(
        this.getBarComponent({
          name: d[this.idField],
          pos: { x: 200, y: i * 40 },
          value: d[this.valueField],
          shape: { width: d[this.valueField] * 20, height: 30 },
          color: "#fff",
          radius: 4,
        })
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
    const labelPadding = 8;
    const res = new Component({
      position: options.pos,
    });
    const bar = new Rect({
      shape: options.shape,
      fillStyle: options.color,
      radius: options.radius,
      clip: true,
    });
    const label = new Text({
      text: `${options.name}`,
      textAlign: "right",
      textBaseline: "bottom",
      fontSize: options.shape.height * 0.8,
      font: "Sarasa Mono SC",
      position: { x: 0 - labelPadding, y: options.shape.height },
      fillStyle: options.color,
    });
    const valueComp = new Text({
      textBaseline: "bottom",
      text: `${d3.format(",.2f")(options.value)}`,
      position: {
        x: options.shape.width + labelPadding,
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
        x: options.shape.width - labelPadding - imagePlaceholder,
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
    res.children.push(valueComp);
    res.children.push(label);
    return res as Component;
  }
  private getData() {
    this.data = _.cloneDeep(recourse.data.get("data"));
    this.data.forEach((d: any) => {
      Object.keys(d).forEach((k) => {
        switch (k) {
          case this.dateField:
            d[k] = new Date(
              new Date().getTimezoneOffset() * 60 * 1000 +
                new Date(d[this.dateField]).getTime()
            );
            break;
          case this.idField:
            break;
          default:
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
