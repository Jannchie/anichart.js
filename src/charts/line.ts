import { scaleLinear, scaleTime } from "d3-scale";
import * as d3 from "d3";
import { Base } from "../components";
import { LineChartOptions } from "../options/line-chart-options";

export class LineChart extends Base {
  shape: { width: number; height: number };
  scales: {
    x: d3.ScaleTime<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  dataGroup: Map<any, any[]>;
  line: d3.Line<[number, number]>;
  padding: { left: number; right: number; top: number; bottom: number };
  constructor(options: LineChartOptions) {
    super(options);
    this.reset(options);
  }
  reset(options: LineChartOptions) {
    super.reset(options);
    if (this.ani) {
      if (!this.shape) {
        this.shape = { width: this.ani.width, height: this.ani.height };
      }
      if (!this.padding) {
        this.padding = { left: 50, right: 50, top: 50, bottom: 50 };
      }
      if (this.ani.data) {
        this.setScale();
        this.setDataGroup();
        this.setLine();
      }
    }
  }
  private setLine() {
    this.line = d3
      .line()
      .defined((d: any) => !isNaN(d["value"]))
      .x((d: any) => this.scales.x(new Date(d["date"])))
      .y((d: any) => this.scales.y(Number(d["value"])));
  }

  private setDataGroup() {
    this.dataGroup = d3.group(this.ani.data, (d: any) => d["id"]);
  }

  private setScale() {
    let tsRange = d3.extent(this.ani.data, (d: any) => new Date(d["date"]));
    let dtRange = d3.extent(this.ani.data, (d: any) => Number(d["value"]));
    this.scales = {
      x: scaleTime(tsRange, [
        this.padding.left,
        this.shape.width - this.padding.right,
      ]),
      y: scaleLinear(dtRange, [
        this.shape.height - this.padding.bottom,
        this.padding.top,
      ]),
    };
  }

  render(n: number): void {
    this.dataGroup.forEach((v) => {
      this.ani.ctx.strokeStyle = "#FFF";
      this.ani.ctx.lineWidth = 2;
      this.line.curve(d3.curveBasis).context(this.ani.ctx)(v);
      this.ani.ctx.stroke();
    });
  }
}
