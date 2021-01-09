import * as d3 from "d3";
import { canvasHelper } from "../CanvasHelper";
import { colorPicker } from "../ColorPicker";
import { Arc } from "../component/Arc";
import { Component } from "../component/Component";
import { Line } from "../component/Line";
import { Rect } from "../component/Rect";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";

interface LineChartOptions extends BaseChartOptions {
  pointerR?: number;
}
export class LineChart extends BaseChart {
  constructor(options: LineChartOptions) {
    super(options);
    if (!options) return;
  }
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
      fillStyle: "#0000",
    });
    const points = new Component({
      position: { x: this.margin.left, y: this.margin.top },
    });
    const res = new Component({ position: this.position });
    const maxX = d3.max(this.scales.x.range());
    this.dataGroup.forEach((v: any[], k) => {
      const line = new Line();
      const color = colorPicker.getColor(k);
      line.strokeStyle = color;
      line.path = new Path2D(lineGen.curve(d3.curveMonotoneX)(v));
      line.lineWidth = 3;
      lineArea.children.push(line);

      const areaPath = new Path2D(areaGen.curve(d3.curveMonotoneX)(v));
      const y = this.findY(areaPath, maxX);
      const point = new Arc({
        fillStyle: color,
        radius: 5,
        alpha: y !== undefined ? 1 : 0,
        position: { x: maxX, y },
      });

      points.children.push(point);
    });
    res.children.push(lineArea);
    res.children.push(points);
    return res;
  }

  private findY(area: Path2D, x: number) {
    const l = 0;
    const r = this.shape.height;
    // 9w => 4k
    // 使用中值优化，提升>22倍的性能
    const b = d3.bisector((d: number) => {
      return canvasHelper.isPointInPath(area, x, d);
    }).left;
    const range = d3.range(l, r, 1);
    const index = b(range, true);
    return range[index];
  }
}
