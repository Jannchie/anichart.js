import * as d3 from "d3";
import { DSVRowArray } from "d3";
import { scaleLinear } from "d3-scale";
import { Axis } from "../components/Axis";
import { ChartComponent } from "../components/ChartComponent";
import { LineChartOptions } from "../options/line-chart-options";
import { DefaultFontOptions } from "./../options/font-options";

export class LineChart extends ChartComponent {
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
  pointR = 8;
  labelFont = new DefaultFontOptions();
  timeFormat = "%Y-%m-%d";
  valueFormat = ",d";
  days: number;
  tickFadeThreshold = 100;
  private xMax: number;
  strict = false;
  axis: Axis;
  getLabel(k: string, y: number): string {
    return `${k}: ${d3.format(this.valueFormat)(y)}`;
  }

  constructor(options?: LineChartOptions) {
    super(options);
    this.labelFont.textBaseline = "middle";
    this.labelFont.fontSize = 18;
    this.axis = new Axis();
    this.addComponent(this.axis);
    this.update();
  }
  update() {
    super.update();
    if (this.renderer) {
      this.shape = {
        width: this.renderer.shape.width,
        height: this.renderer.shape.height,
      };
      if (!this.padding) {
        this.padding = {
          left: 0,
          right: 0,
          top: this.labelFont.fontSize,
          bottom: 0,
        };
      }
      if (!this.margin) {
        this.margin = { left: 20, right: 20, top: 20, bottom: 20 };
      }
      if (!this.showTime) {
        this.showTime = [0, this.player.sec];
      }
      if (this.data && this.ctx) {
        this.initData();
        this.calData();
        // this.setRange();
        this.setScale();
        this.setLine();
        this.setDataGroup();
        this.calLabelMaxLength();
      }
    }
    this.components.forEach((c) => c.update());
  }
  private calLabelMaxLength() {
    this.padding.right = (() => {
      if (!this.dataGroup) return 0;
      let max = 0;
      const y = d3.max(this.data, (d) => Number(d[this.valueKey]));
      this.dataGroup.forEach((_, k) => {
        this.ctx.setFontOptions(this.labelFont);
        const current = this.ctx.measureText(
          this.getLabel(k, this.scales.y.invert(y))
        );
        if (current.width > max) max = current.width;
      });
      return max;
    })();
  }

  private calData() {
    if (this.strict === true) {
      const dts = Array.from(
        d3.group(this.data, (d) => d[this.dateKey]).keys()
      ).sort((a, b) => Number(a) - Number(b));
      const idG = d3.group(this.data, (d) => d[this.idKey]);
      const ids = Array.from(idG.keys());
      for (const id of ids) {
        const list = d3.group(idG.get(id), (d) => d[this.dateKey]);
        for (let i = 0; i < dts.length - 1; i++) {
          if (list.get(dts[i]) && !list.get(dts[i + 1])) {
            const a = list.get(dts[i]) as any;
            const tmp = {} as any;
            tmp[this.dateKey] = dts[i + 1];
            tmp[this.idKey] = a[0][this.idKey];
            tmp[this.valueKey] = "-";
            this.data.push(tmp);
          }
        }
      }
    }

    this.data.sort((a: any, b: any) => a[this.dateKey] - b[this.dateKey]);
  }

  private initData() {
    this.data.map((d: any) => {
      d[this.dateKey] = new Date(d[this.dateKey]).getTime();
      d[this.valueKey] = Number(d[this.valueKey]);
      return d;
    });
    this.tsRange = d3.extent(this.data, (d: any) => d[this.dateKey] as number);
    this.dtRange = d3.extent(this.data, (d: any) => d[this.valueKey] as number);
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
    this.dataGroup = d3.group(this.data, (d: any) => d[this.idKey]);
  }

  private setScale() {
    const delta = this.tsRange[1] - this.tsRange[0];
    const frames = this.player.fps * this.player.sec;
    const c = this.player.cFrame;
    const r = this.tsRange[0] + delta * (c / frames);
    let l = this.tsRange[0];
    if (this.days) {
      l = r - this.days * 86400 * 1000;
    }
    this.scales = {
      x: scaleLinear([l, r], [this.xLeft, this.xRight]),
      y: scaleLinear(this.dtRange, [this.yTop, this.yBottom]),
    };

    this.axis.scales = this.scales;
  }
  private get yBottom() {
    return this.padding.top + this.margin.top;
  }

  private get yTop() {
    return this.shape.height - this.padding.bottom - this.margin.bottom;
  }

  private get xRight() {
    return this.shape.width - this.padding.right - this.margin.right;
  }

  private get xLeft() {
    return this.padding.left + this.margin.left;
  }

  private setRange(n: number = 0) {
    // const delta = this.scales.x.domain();
    // const frames = this.player.fps * this.player.sec - 1;
    // this.tsRange[1] = this.tsRange[0] + delta * (this.player.cFrame / frames);
    // if (this.days) {
    //   this.tsRange[0] = this.tsRange[1] - this.days * 86400 * 1000;
    // }
  }
  preRender(): void {
    super.preRender();

    this.setLine();
    this.setDataGroup();
    this.xMax =
      this.cPos.x + this.shape.width - this.padding.right - this.margin.right;
    this.setScale();
    // this.setRange();
  }
  render(): void {
    this.dataGroup.forEach((v, k: string) => {
      // ------------------------------------------------------------
      // 裁剪曲线绘图区域
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(
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
      this.ctx.closePath();
      this.ctx.clip();
      const color = this.renderer.colorPicker.getColor(k);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = this.lineWidth;
      // 绘制曲线
      const path = new Path2D(this.lineGen.curve(d3.curveMonotoneX)(v));
      const area = new Path2D(this.areaGen.curve(d3.curveMonotoneX)(v));
      this.ctx.stroke(path);
      // this.ctx.stroke(area);
      // 取消裁剪
      this.ctx.restore();
      // ------------------------------------------------------------
      // 寻找小圆点的Y轴坐标
      const y = this.findY(area);
      // 绘制圆点
      this.ctx.fillStyle = color;
      this.ctx.fillCircle(this.xMax, y, this.pointR);
      this.ctx.setFontOptions(this.labelFont);
      // 绘制Label
      this.ctx.fillText(
        this.getLabel(k, this.scales.y.invert(y)),
        this.xMax + 15,
        y
      );
    });
  }

  private findY(area: Path2D) {
    const l = this.cPos.y + this.padding.top + this.margin.top;
    const r =
      this.cPos.y +
      this.shape.height -
      this.padding.bottom -
      this.margin.bottom +
      1;
    const x = this.xMax;
    // 9w => 4k
    // 使用中值优化，提升>22倍的性能
    const b = d3.bisector((d: number) => {
      return this.ctx.isPointInPath(area, x, d);
    }).left;
    const range = d3.range(l, r, 1);
    const index = b(range, true);
    return range[index];
  }
}
