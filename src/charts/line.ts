import * as d3 from "d3";
import { Base } from "../components";
import { LineChartOptions } from "../options/line-chart-options";

export class LineChart extends Base {
  shape: { width: number; height: number } = { width: 400, height: 200 };
  reset(options: LineChartOptions) {
    super.reset(options);
  }
  render(n: number): void {
    throw new Error("Method not implemented.");
  }
}
