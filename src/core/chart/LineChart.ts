import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart } from "./BaseChart";

export interface LineChartOptions {
  data: string;
  meta: string;
}
export class LineChart extends BaseChart {
  setup(stage: Stage) {
    super.setup(stage);
    console.log(this.meta);
    console.log(this.data);
  }
  getComponent(sec: number) {
    return new Component();
  }
}
