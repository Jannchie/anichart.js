import { Ani } from "../ani/Ani";
import { Stage } from "../Stage";

export interface LineChartOptions {
  data: string;
  meta: string;
}
export class LineChart extends Ani {
  setup(stage: Stage) {
    super.setup(stage);
  }
  getComponent(sec: number) {
    return {};
  }
}
