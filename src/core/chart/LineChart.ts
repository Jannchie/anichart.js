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
  pointerR: number = 10;
  constructor(options: LineChartOptions) {
    super(options);
    if (!options) return;
    if (options.pointerR) this.pointerR = options.pointerR;
  }
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  setup(stage: Stage) {
    super.setup(stage);
    this.yTickFormat = (n: number | { valueOf(): number }) => {
      return d3.timeFormat("%Y-%m-%d")(this.secToDate(n));
    };
    this.historyMax = d3.min(this.data, (d) => d[this.valueField]);
    this.historyMin = d3.max(this.data, (d) => d[this.valueField]);
  }

  historyMax: number;
  historyMin: number;
  getComponent(sec: number) {
    const currentData = this.getCurrentData(sec);
    const valueRange = d3.extent(currentData, (d) => d[this.valueField]);
    if (this.historyMax > valueRange[1]) {
      valueRange[1] = this.historyMax;
    }
    if (this.historyMin < valueRange[0]) {
      valueRange[0] = this.historyMin;
    }
    valueRange[0] *= 0.8;
    valueRange[1] *= 1.2;
    const temp =
      sec < this.aniTime[0]
        ? this.aniTime[0]
        : sec > this.aniTime[1]
        ? this.aniTime[1]
        : sec;
    if (this.aniTime[0] === temp) return new Component();
    this.scales = {
      x: d3.scaleLinear(
        [this.aniTime[0], temp],
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
    const res = new Component({
      position: this.position,
      alpha: this.alphaScale(sec - this.fadeTime[0] - this.freezeTime[0]),
    });
    const maxX = d3.max(this.scales.x.range());
    this.dataGroup.forEach((v: any[], k) => {
      const line = new Line();
      const color = colorPicker.getColor(k);
      line.strokeStyle = color;
      line.path = new Path2D(lineGen.curve(d3.curveMonotoneX)(v));
      line.lineWidth = 3;
      lineArea.children.push(line);

      const areaPath = new Path2D(areaGen.curve(d3.curveMonotoneX)(v));
      const currentY = this.findY(areaPath, maxX);
      const point = new Arc({
        fillStyle: color,
        radius: this.pointerR,
        alpha: currentY !== undefined ? 1 : 0,
        position: { x: maxX, y: currentY },
      });
      const maxValue = this.scales.y.invert(currentY);
      if (maxValue > this.historyMax) {
        this.historyMax = maxValue;
      } else if (maxValue < this.historyMin) {
        this.historyMin = maxValue;
      }
      points.children.push(point);
    });

    res.children.push(lineArea);
    res.children.push(points);
    const x = this.getXAxisComponent(this.scales.y);
    const y = this.getYAxisComponent(this.scales.x);
    res.children.push(x);
    res.children.push(y);
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
