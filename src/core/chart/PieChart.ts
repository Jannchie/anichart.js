import { BaseChartOptions, BaseChart } from "./BaseChart";
import * as d3 from "d3";
import { Component } from "../component/Component";
import { Line } from "../component/Line";
import { colorPicker } from "../ColorPicker";
interface PieChartOptions extends BaseChartOptions {
  radius?: [number, number];
  cornerRadius?: number;
  padAngle?: number;
}
export class PieChart extends BaseChart implements PieChartOptions {
  radius: [number, number] = [0, 120];
  cornerRadius: number = 4;
  padAngle: number = 5;
  keyDurationSec = 0.25;
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
      const comp = new Line({
        fillStyle: colorPicker.getColor(d.data[this.idField]),
        strokeStyle: "#0000",
        path,
      });
      res.children.push(comp);
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
