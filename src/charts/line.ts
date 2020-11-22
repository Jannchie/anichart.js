import { scaleLinear, scaleTime } from "d3-scale";
import * as d3 from "d3";
import { Base } from "../components";
import { LineChartOptions } from "../options/line-chart-options";

export class LineChart extends Base {
  shape: { width: number; height: number };
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  dataGroup: Map<any, any[]>;
  line: d3.Line<[number, number]>;
  padding: { left: number; right: number; top: number; bottom: number };
  data: any;
  tsRange: [number, number];
  dtRange: [number, number];
  showTime: [number, number];
  count: number = 0;
  area: d3.Area<[number, number]>;

  constructor(options: LineChartOptions) {
    super(options);
    this.reset(options);
  }
  reset(options: LineChartOptions) {
    super.reset(options);
    if (this.ani) {
      this.data = this.ani.data;
      if (!this.shape) {
        this.shape = { width: this.ani.width, height: this.ani.height };
      }
      if (!this.padding) {
        this.padding = { left: 50, right: 50, top: 50, bottom: 50 };
      }
      if (!this.showTime) {
        this.showTime = [0, this.ani.sec];
      }
      if (this.data) {
        this.data.map((d: any) => {
          d["date"] = new Date(d["date"]).getTime();
          d["value"] = Number(d["value"]);
          return d;
        });
        this.setRange();
        this.setScale();
        this.setLine();
        this.setDataGroup();
      }
    }
  }
  private setLine() {
    this.line = d3
      .line()
      .defined((d: any) => !isNaN(d["value"]))
      .x((d: any) => this.scales.x(d["date"]))
      .y((d: any) => this.scales.y(d["value"]));
    this.area = d3
      .area()
      .defined((d: any) => !isNaN(d["value"]))
      .x((d: any) => this.scales.x(d["date"]))
      .y0(this.scales.y(0))
      .y1((d: any) => this.scales.y(d["value"]));
  }

  private setDataGroup() {
    this.dataGroup = d3.group(this.ani.data, (d: any) => d["id"]);
  }

  private setScale() {
    this.scales = {
      x: scaleLinear(this.tsRange, [
        this.padding.left,
        this.shape.width - this.padding.right,
      ]),
      y: scaleLinear(this.dtRange, [
        this.shape.height - this.padding.bottom,
        this.padding.top,
      ]),
    };
  }
  private setRange(n?: number) {
    if (!n) {
      n = this.ani.sec * this.ani.fps - 1;
    }
    this.tsRange = d3.extent(this.data, (d: any) => <number>d["date"]);
    this.dtRange = d3.extent(this.data, (d: any) => <number>d["value"]);
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
  }
  render(n: number): void {
    this.setRange(n);
    this.dataGroup.forEach((v) => {
      //----------
      // 裁剪曲线绘图区域
      this.ani.ctx.save();
      this.ani.ctx.beginPath();
      this.ani.ctx.rect(
        this._pos.x + this.padding.left,
        this._pos.y + this.padding.top,
        this.shape.width - this.padding.left - this.padding.right,
        this.shape.height - this.padding.top - this.padding.bottom + 1
      );
      this.ani.ctx.closePath();
      this.ani.ctx.clip();
      this.ani.ctx.strokeStyle = "#FFF";
      this.ani.ctx.lineWidth = 2;
      // 绘制曲线
      let path = new Path2D(this.line.curve(d3.curveMonotoneX)(v));
      let area = new Path2D(this.area.curve(d3.curveMonotoneX)(v));
      this.ani.ctx.stroke(path);
      // this.ani.ctx.fillStyle = "#FFF";
      // this.ani.ctx.fill(path);
      // 取消裁剪
      this.ani.ctx.restore();
      //----------
      let y = this.findY(area);

      this.ani.ctx.fillStyle = "#fff";

      this.ani.ctx.fillRadiusRect(
        this._pos.x + this.shape.width - this.padding.right - 5,
        y - 5,
        10,
        10,
        5
      );
    });
  }

  private findY(area: Path2D) {
    let l = this._pos.y + this.padding.top;
    let r = this._pos.y + this.shape.height - this.padding.bottom + 1;
    let x = this._pos.x + this.shape.width - this.padding.right;
    // 9w => 4k
    // 使用中值优化，提升22倍性能
    let b = d3.bisector((d: number) => {
      this.count++;
      return this.ani.ctx.isPointInPath(area, x, d);
    }).left;
    let range = d3.range(l, r, 1);
    let index = b(range, true);
    return range[index];
  }
}
