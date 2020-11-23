import { DefaultFontOptions } from "./../options/font-options";
import { Base } from "./../components/base";
import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
import { LineChartOptions } from "../options/line-chart-options";
import { DSVRowArray } from "d3";

export class LineChart extends Base {
  shape: { width: number; height: number };
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  dataGroup: Map<any, any[]>;
  lineGen: d3.Line<[number, number]>;
  areaGen: d3.Area<[number, number]>;
  padding: { left: number; right: number; top: number; bottom: number };
  margin: { left: number; right: number; top: number; bottom: number };
  data: DSVRowArray<string>;
  tsRange: [number, number];
  dtRange: [number, number];
  showTime: [number, number];
  lineWidth = 4;
  dateKey = "date";
  valueKey = "value";
  idKey = "id";
  colorKey = "id";
  pointR = 8;
  labelFont = new DefaultFontOptions();
  timeFormat = "%Y-%m-%d";
  valueFormat = ",d";
  private xMax: number;

  getLabel(k: string, y: number): string {
    return `${k}: ${d3.format(this.valueFormat)(this.scales.y.invert(y))}`;
  }

  constructor(options: LineChartOptions) {
    super(options);
    this.reset(options);
    this.labelFont.textBaseline = "middle";
    this.labelFont.fontSize = 18;
  }
  reset(options: LineChartOptions) {
    super.reset(options);
    if (this.ani) {
      this.data = this.ani.data;
      if (!this.shape) {
        this.shape = { width: this.ani.width, height: this.ani.height };
      }
      if (!this.padding) {
        this.padding = {
          left: 0,
          right: 0,
          top: 0,
          bottom: this.labelFont.fontSize + 10,
        };
      }
      if (!this.margin) {
        this.margin = { left: 20, right: 20, top: 20, bottom: 20 };
      }
      if (!this.showTime) {
        this.showTime = [0, this.ani.sec];
      }
      if (this.data) {
        this.data.map((d: any) => {
          d[this.dateKey] = new Date(d[this.dateKey]).getTime();
          d[this.valueKey] = Number(d[this.valueKey]);
          return d;
        });
        this.setRange();
        this.setScale();
        this.setLine();
        this.setDataGroup();
        this.padding.right = (() => {
          if (!this.dataGroup) return 0;
          let max = 0;
          let y = d3.max(this.data, (d) => Number(d[this.valueKey]));
          this.dataGroup.forEach((_, k) => {
            this.ani.ctx.setFontOptions(this.labelFont);
            let current = this.ani.ctx.measureText(this.getLabel(k, y));
            console.log(this.getLabel(k, y));
            if (current.width > max) max = current.width;
          });
          return max;
        })();
      }
    }
  }
  private setLine() {
    this.lineGen = d3
      .line()
      .defined((d: any) => !isNaN(d[this.valueKey]))
      .x((d: any) => this.scales.x(d[this.dateKey]))
      .y((d: any) => this.scales.y(d[this.valueKey]));
    this.areaGen = d3
      .area()
      .defined((d: any) => !isNaN(d[this.valueKey]))
      .x((d: any) => this.scales.x(d[this.dateKey]))
      .y0(this.scales.y(0))
      .y1((d: any) => this.scales.y(d[this.valueKey]));
  }

  private setDataGroup() {
    this.dataGroup = d3.group(this.ani.data, (d: any) => d[this.idKey]);
  }

  private setScale() {
    this.scales = {
      x: scaleLinear(this.tsRange, [
        this.padding.left + this.margin.left,
        this.shape.width - this.padding.right - this.margin.right,
      ]),
      y: scaleLinear(this.dtRange, [
        this.shape.height - this.padding.bottom - this.margin.bottom,
        this.padding.top + this.margin.top,
      ]),
    };
  }
  private setRange(n?: number) {
    if (!n) {
      n = this.ani.sec * this.ani.fps - 1;
    }
    this.tsRange = d3.extent(this.data, (d: any) => <number>d[this.dateKey]);
    this.dtRange = d3.extent(this.data, (d: any) => <number>d[this.valueKey]);
  }
  preRender(n: number): void {
    super.preRender(n);
    this.tsRange[1] =
      this.tsRange[0] +
      (this.tsRange[1] - this.tsRange[0]) *
        (n / (this.ani.fps * this.ani.sec - 1));
    this.setScale();
    this.setLine();
    this.setDataGroup();
    this.xMax =
      this.cPos.x + this.shape.width - this.padding.right - this.margin.right;
  }
  render(n: number): void {
    this.setRange(n);
    this.dataGroup.forEach((v, k: string) => {
      //------------------------------------------------------------
      // 裁剪曲线绘图区域
      this.ani.ctx.save();
      this.ani.ctx.beginPath();
      this.ani.ctx.rect(
        this.cPos.x + this.padding.left + this.margin.left,
        this.cPos.y + this.padding.top + this.margin.top - this.lineWidth,
        this.shape.width -
          this.padding.left -
          this.padding.right -
          this.margin.left -
          this.margin.right,
        this.shape.height -
          this.padding.top -
          this.padding.bottom -
          this.margin.top -
          this.margin.bottom +
          this.lineWidth * 2
      );
      this.ani.ctx.closePath();
      this.ani.ctx.clip();
      let color = this.ani.color.getColor(k);
      this.ani.ctx.strokeStyle = color;
      this.ani.ctx.lineWidth = this.lineWidth;
      // 绘制曲线
      let path = new Path2D(this.lineGen.curve(d3.curveMonotoneX)(v));
      let area = new Path2D(this.areaGen.curve(d3.curveMonotoneX)(v));
      this.ani.ctx.stroke(path);
      // 取消裁剪
      this.ani.ctx.restore();
      //------------------------------------------------------------
      // 寻找小圆点的Y轴坐标
      let y = this.findY(area);
      // 绘制圆点
      this.ani.ctx.fillStyle = color;
      this.ani.ctx.fillCircle(this.xMax, y, this.pointR);
      this.ani.ctx.setFontOptions(this.labelFont);
      // 绘制Label
      this.ani.ctx.fillText(this.getLabel(k, y), this.xMax + 15, y);
      // tick
    });
    let ticks = this.scales.x.ticks(5);
    this.ani.ctx.textBaseline = "bottom";
    this.ani.ctx.fillStyle = "#FFF";
    for (let tick of ticks) {
      this.ani.ctx.fillText(
        d3.timeFormat(this.timeFormat)(new Date(tick)),
        this.scales.x(tick),
        this.shape.height - this.margin.bottom
      );
    }
  }

  private findY(area: Path2D) {
    let l = this.cPos.y + this.padding.top + this.margin.top;
    let r =
      this.cPos.y +
      this.shape.height -
      this.padding.bottom -
      this.margin.bottom +
      1;
    let x = this.xMax;
    // 9w => 4k
    // 使用中值优化，提升>22倍的性能
    let b = d3.bisector((d: number) => {
      return this.ani.ctx.isPointInPath(area, x, d);
    }).left;
    let range = d3.range(l, r, 1);
    let index = b(range, true);
    return range[index];
  }
}
