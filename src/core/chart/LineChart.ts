import { canvasHelper } from "../CanvasHelper";
import { colorPicker } from "../ColorPicker";
import { Arc } from "../component/Arc";
import { Component } from "../component/Component";
import { Path } from "../component/Path";
import { Rect } from "../component/Rect";
import { Text } from "../component/Text";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
import { font } from "../Constant";
import {
  area,
  bisector,
  curveMonotoneX,
  extent,
  line,
  max,
  range,
  scaleLinear,
  ScaleLinear,
  timeFormat,
} from "d3";
interface LineChartOptions extends BaseChartOptions {
  pointerR?: number;
}
export class LineChart extends BaseChart {
  pointerR: number;
  labelPlaceholder: number = 0;
  labelSize: number = 32;
  labelPadding: number = 4;
  topN: number = 5;
  constructor(options: LineChartOptions) {
    super(options);
    if (!options) return;
    this.pointerR = options.pointerR ?? 10;
  }
  scales: {
    x: ScaleLinear<number, number, never>;
    y: ScaleLinear<number, number, never>;
  };
  setup(stage: Stage) {
    super.setup(stage);
    this.xTickFormat = (n: number | { valueOf(): number }) => {
      return timeFormat("%Y-%m-%d")(this.secToDate(n));
    };
    // Calculate label placeholder
    const textModel = new Text({
      fontSize: this.labelSize,
      font,
    });
    const labelMaxWidth =
      max(this.data, (d) => {
        textModel.text = this.labelFormat(d[this.idField], this.meta, d);
        return canvasHelper.measure(textModel)?.width ?? 0;
      }) ?? 0;
    this.labelPlaceholder = labelMaxWidth;
  }

  getComponent(sec: number) {
    const res = new Component({
      position: this.position,
      alpha: this.alphaScale(sec - this.fadeTime[0] - this.freezeTime[0]),
    });
    if (this.aniTime[0] > sec) return null;
    this.scales = this.getScalesBySec(sec);
    const { xAxis, yAxis } = this.getAxis(sec, this.scales);
    const lineGen = line()
      .defined((d: any) => !isNaN(d[this.valueField]))
      .x((d: any) => this.scales.x(this.secToDate.invert(d[this.dateField])))
      .y((d: any) => this.scales.y(d[this.valueField]));
    const areaGen = area()
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
          this.yAxisPadding -
          this.labelPlaceholder -
          this.labelPadding -
          this.pointerR,
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

    const labels = new Component({
      position: {
        x: this.margin.left + this.yAxisWidth + this.yAxisPadding,
        y: this.margin.top + this.xAxisHeight + this.xAxisPadding,
      },
    });
    const maxX = max(this.scales.x.range());
    // 找不到最大值说明啥数据都没有，直接返回
    if (!maxX) return res;
    this.dataGroupByID.forEach((v: any[], k) => {
      const line = new Path();
      const color = colorPicker.getColor(k);
      line.strokeStyle = color;
      line.path = lineGen.curve(curveMonotoneX)(v);
      line.lineWidth = 3;
      lineArea.children.push(line);

      const areaPath = areaGen.curve(curveMonotoneX)(v);

      // 如果画不出Path直接返回
      if (!areaPath) return;

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
      const data = new Map();
      data.set(this.valueField, maxValue);
      const label = new Text({
        text: this.labelFormat(k, this.meta, data),
        fontSize: this.labelSize,
        font,
        textAlign: "left",
        textBaseline: "middle",
        position: { x: maxX + this.labelPadding + this.pointerR, y: currentY },
        fillStyle: color,
      });
      labels.children.push(label);
    });
    res.children.push(lineArea);
    res.children.push(points);
    res.children.push(xAxis);
    res.children.push(yAxis);
    res.children.push(labels);
    return res;
  }
  protected getScalesBySec(sec: number) {
    const currentData = this.getCurrentData(sec);
    let valueRange = extent(currentData, (d) => d[this.valueField] as number);
    if (valueRange[0] == undefined) {
      valueRange = [0, 0];
    }
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
      x: scaleLinear(
        [this.aniTime[0], trueSec],
        [
          0,
          this.shape.width -
            this.margin.left -
            this.margin.right -
            this.yAxisWidth -
            this.yAxisPadding -
            this.labelPlaceholder -
            this.labelPadding -
            this.pointerR,
        ]
      ),
      y: scaleLinear(valueRange, [
        this.shape.height -
          this.margin.top -
          this.margin.bottom -
          this.xAxisHeight,
        this.xAxisPadding,
      ]),
    };
    return scales;
  }

  private findY(area: Path2D | string, x: number) {
    const l = 0;
    const r = this.shape.height;
    // 9w => 4k
    // 使用中值优化，提升>22倍的性能
    const b = bisector((d: number) => {
      return canvasHelper.isPointInPath(area, x, d);
    }).left;
    const yRange = range(l, r, 1);
    const index = b(yRange, true);
    return yRange[index];
  }
}
