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
  constructor(options?: PieChartOptions) {
    super(options);
    if (options) {
      Object.assign(this, options);
    }
  }

  getComponent(sec: number) {
    const res = new Component({ position: this.position });
    const pieGen = d3
      .pie()
      .padAngle((Math.PI / 180) * this.padAngle)
      .value((d) => d[this.valueField]);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    const currentData = this.getCurrentData(sec);
    const pieData = pieGen(currentData);

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
        path: new Path2D(path),
      });
      res.children.push(comp);
    }
    return res;
  }
}
