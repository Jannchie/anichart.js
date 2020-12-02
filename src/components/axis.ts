import * as d3 from "d3";
import { ScaleLinear, ScaleLogarithmic } from "d3";
import { DefaultFontOptions } from "../options/font-options";
import { GroupComponent } from "./Group";
export class Axis extends GroupComponent {
  scales: {
    x: d3.ScaleLinear<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
  };
  private tickAlpha: d3.ScaleLinear<number, number, never>;
  tickFadeThreshold = 100;
  timeFormat = "%Y-%m-%d";
  valueFormat = ",d";
  labelFont = new DefaultFontOptions();
  data: any[];
  xScaleY: number;
  yScaleX: number;
  constructor() {
    super();
  }
  update() {
    super.update();
    if (this.scales) {
      const [xLeft, xRight] = this.scales.x.range();
      const xLeftShow = xLeft + this.tickFadeThreshold;
      const xRightShow = xRight - this.tickFadeThreshold;
      this.tickAlpha = d3
        .scaleLinear([xLeft, xLeftShow, xRightShow, xRight], [0, 1, 1, 0])
        .clamp(true);
    }
  }
  render() {
    const ticks = this.scales.x.ticks(5);
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = "#FFF";
    for (const tick of ticks) {
      const x = this.scales.x(tick);
      this.ctx.globalAlpha = this.cAlpha * this.tickAlpha(x);
      this.ctx.fillText(
        d3.timeFormat(this.timeFormat)(new Date(tick)),
        x,
        this.scales.y.range()[1]
      );
    }
  }
}
