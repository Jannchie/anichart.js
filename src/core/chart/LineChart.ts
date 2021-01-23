import * as d3 from "d3";
import { CanvasHelper, canvasHelper } from "../CanvasHelper";
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
    this.xTickFormat = (n: number | { valueOf(): number }) => {
      return d3.timeFormat("%Y-%m-%d")(this.secToDate(n));
    };
  }

  getComponent(sec: number) {
    const res = new Component({
      position: this.position,
      alpha: this.alphaScale(sec - this.fadeTime[0] - this.freezeTime[0]),
    });
    if (this.aniTime[0] > sec) return this.component;
    this.scales = this.getScalesBySec(sec);
    const { xAxis, yAxis } = this.getAxis(sec, this.scales);
    const lineGen = d3
      .line()
      .defined((d: any) => !isNaN(d[this.valueField]))
      .x((d: any) => this.scales.x(this.secToDate.invert(d[this.dateField])))
      .y((d: any) => this.scales.y(d[this.valueField]));
    const areaGen = d3
      .area()
      .defined((d: any) => !isNaN(d[this.valueField]))
      .x((d: any) => this.scales.x(this.secToDate.invert(d[this.dateField])))
      .y0(this.shape.height)
      .y1((d: any) => this.scales.y(d[this.valueField]));
    const lineArea = new Rect({
      clip: true,
      position: {
        x: this.margin.left + this.yAxisWidth + this.xAxisPadding,
        y: this.margin.top + this.xAxisHeight + this.yAxisPadding,
      },
      shape: {
        width:
          this.shape.width -
          this.margin.left -
          this.margin.right -
          this.yAxisWidth -
          this.yAxisPadding,
        height:
          this.shape.height -
          this.margin.top -
          this.margin.bottom -
          this.xAxisHeight -
          this.xAxisPadding,
      },
      fillStyle: "#0000",
    });
    const points = new Component({
      position: {
        x: this.margin.left + this.yAxisWidth + this.yAxisPadding,
        y: this.margin.top + this.xAxisHeight + this.xAxisPadding,
      },
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
    res.children.push(xAxis);
    res.children.push(yAxis);
    return res;
  }

  protected getScalesBySec(sec: number) {
    const currentData = this.getCurrentData(sec);
    const valueRange = d3.extent(currentData, (d) => d[this.valueField]);
    if (this.historyMax > valueRange[1]) {
      valueRange[1] = this.historyMax;
    }
    if (this.historyMin < valueRange[0]) {
      valueRange[0] = this.historyMin;
    }
    const delta = (valueRange[1] - valueRange[0]) * 0.1;
    valueRange[0] -= delta;
    valueRange[1] += delta;
    const trueSec =
      sec < this.aniTime[0]
        ? this.aniTime[0]
        : sec > this.aniTime[1]
        ? this.aniTime[1]
        : sec;
    const scales = {
      x: d3.scaleLinear(
        [this.aniTime[0], trueSec],
        [
          0,
          this.shape.width -
            this.margin.left -
            this.margin.right -
            this.yAxisWidth -
            this.yAxisPadding,
        ]
      ),
      y: d3.scaleLinear(valueRange, [
        this.shape.height -
          this.margin.top -
          this.margin.bottom -
          this.xAxisHeight,
        this.xAxisPadding,
      ]),
    };
    return scales;
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
