import * as d3 from "d3";
import { Base } from "../components";
import { LineChartOptions } from "../options/line-chart-options";

export class LineChart extends Base {
  shape: { width: number; height: number };
  reset(options: LineChartOptions) {
    super.reset(options);
    if ((this.shape = undefined)) {
    }
  }
  render(n: number): void {}
}
