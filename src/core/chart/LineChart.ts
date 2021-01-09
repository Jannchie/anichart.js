import * as d3 from "d3";
import { colorPicker } from "../ColorPicker";
import { Component } from "../component/Component";
import { Line } from "../component/Line";
import { Rect } from "../component/Rect";
import { Stage } from "../Stage";
import { BaseChart } from "./BaseChart";

export class LineChart extends BaseChart {
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  setup(stage: Stage) {
    super.setup(stage);
  }
  getComponent(sec: number) {
    const currentData = this.getCurrentData(sec);
    // const valueRange = d3.extent(currentData, (d) => d[this.valueField]);
    const valueRange = [0, 12];
    this.scales = {
      x: d3.scaleLinear(
        [this.aniTime[0], d3.min([sec, this.aniTime[1]])],
        [0, this.shape.width - this.margin.left - this.margin.right]
      ),
      y: d3.scaleLinear(valueRange, [
        this.shape.height - this.margin.top - this.margin.bottom,
        0,
      ]),
    };
    const lineGen = d3
      .line()
      .defined((d: any) => !isNaN(d[this.valueField]))
      .x((d: any) => this.scales.x(this.secToDate.invert(d[this.dateField])))
      .y((d: any) => this.scales.y(d[this.valueField]));
    const areaGen = d3
      .area()
      .defined((d: any) => !isNaN(d[this.valueField]))
      .x((d: any) => this.scales.x(this.secToDate.invert(d[this.dateField])))
      .y0(this.scales.y(0))
      .y1((d: any) => this.scales.y(d[this.valueField]));
    const lineArea = new Rect({
      clip: true,
      position: { x: this.margin.left, y: this.margin.top },
      shape: {
        width: this.shape.width - this.margin.left - this.margin.right,
        height: this.shape.height - this.margin.top - this.margin.bottom,
      },
      fillStyle: "#0002",
    });
    const res = new Component();
    this.dataGroup.forEach((v: any[], k) => {
      const line = new Line();
      line.strokeStyle = colorPicker.getColor(k);
      line.path = new Path2D(lineGen.curve(d3.curveMonotoneX)(v));
      line.lineWidth = 3;
      lineArea.children.push(line);
      // line.area = new Path2D(areaGen.curve(d3.curveMonotoneX)(v));
    });
    res.children.push(lineArea);
    return res;
  }
}
