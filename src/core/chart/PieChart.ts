import { BaseChartOptions, BaseChart } from "./BaseChart";
import * as d3 from "d3";
import { Component } from "../component/Component";
import { Line } from "../component/Line";
import { colorPicker } from "../ColorPicker";
interface PieChartOptions extends BaseChartOptions {
  radius?: number | [number, number];
}
export class PieChart extends BaseChart implements PieChartOptions {
  radius?: number | [number, number];
  constructor(options?: PieChartOptions) {
    super(options);
    if (options) {
      Object.assign(this, options);
    }
  }

  getComponent(sec: number) {
    const res = new Component({ position: this.position });
    const pieGen = d3.pie().value((d) => d[this.valueField]);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    const currentData = this.getCurrentData(sec);
    const pieData = pieGen(currentData);

    for (const d of pieData) {
      const path = arc
        .endAngle(d.endAngle)
        .startAngle(d.startAngle)
        .padAngle(d.padAngle)(null);
      const comp = new Line({
        fillStyle: colorPicker.getColor(d.data[this.idField]),
        path: new Path2D(path),
      });
      res.children.push(comp);
    }
    return res;
  }
}
