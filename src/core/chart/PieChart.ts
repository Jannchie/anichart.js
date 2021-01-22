import { BaseChartOptions, BaseChart } from "./BaseChart";
import * as d3 from "d3";
import { Component } from "../component/Component";
import { Line } from "../component/Line";
import { colorPicker } from "../ColorPicker";
import { FontWeight, Text } from "../component/Text";
interface PieChartOptions extends BaseChartOptions {
  radius?: [number, number];
  labelTextStyle?: {
    font: string;
    lineWidth: number;
    fontSize: number;
    fontWeight: FontWeight;
    strokeStyle: string;
  };
  cornerRadius?: number;
  padAngle?: number;
}
export class PieChart extends BaseChart implements PieChartOptions {
  radius: [number, number] = [0, 120];
  cornerRadius: number = 4;
  padAngle: number = 5;
  keyDurationSec = 0.25;
  labelTextStyle = {
    font: "Sarasa Mono SC",
    lineWidth: 6,
    fontSize: 24,
    fontWeight: "bolder" as FontWeight,
    strokeStyle: "#1e1e1e",
  };
  constructor(options?: PieChartOptions) {
    super(options);
    if (options) {
      Object.assign(this, options);
    }
  }

  getComponent(sec: number) {
    const res = super.getComponent(sec);
    const remained = sec % this.keyDurationSec;
    const start = sec - remained;
    const end = start + this.keyDurationSec;
    const comp0 = this.getPieComponent(start);
    const comp1 = this.getPieComponent(end);
    const pieData = d3.scaleLinear(
      [start, end],
      [comp0, comp1]
    )(remained + start);
    const arc = d3.arc().innerRadius(0).outerRadius(100);
    for (const d of pieData) {
      const path = arc
        .endAngle(d.endAngle)
        .padAngle(d.padAngle)
        .startAngle(d.startAngle)
        .innerRadius(this.radius[0])
        .outerRadius(this.radius[1])
        .cornerRadius(this.cornerRadius)
        .padAngle(d.padAngle)(null);
      const centroid = arc.centroid(pieData as any);
      const label = new Text({
        text: d.data[this.idField],
        fontSize: this.labelTextStyle.fontSize,
        lineWidth: this.labelTextStyle.lineWidth,
        font: this.labelTextStyle.font,
        textAlign: "center",
        textBaseline: "middle",
        fillStyle: colorPicker.getColor(d.data[this.idField]),
        fontWeight: this.labelTextStyle.fontWeight,
        strokeStyle: this.labelTextStyle.strokeStyle,
        position: { x: centroid[0], y: centroid[1] },
      });
      const comp = new Line({
        fillStyle: colorPicker.getColor(d.data[this.idField]),
        strokeStyle: "#0000",
        path,
      });
      res.children.push(comp);
      res.children.push(label);
    }
    return res;
  }

  private getPieComponent(sec: number) {
    const pieGen = d3
      .pie()
      .padAngle((Math.PI / 180) * this.padAngle)
      .value((d) => d[this.valueField]);

    const currentData = [...this.dataScales.values()].map((scale) => {
      return scale(sec);
    });
    currentData.sort((a, b) => {
      if (Number.isNaN(b[this.valueField])) {
        return -1;
      } else if (Number.isNaN(a[this.valueField])) {
        return 1;
      } else {
        return b[this.idField] - a[this.idField];
      }
    });
    const pieData = pieGen(currentData);

    return pieData;
  }
}
