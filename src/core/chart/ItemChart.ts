import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { BaseChart, BaseChartOptions } from "./BaseChart";
interface ItemChartOptions extends BaseChartOptions {
  style?: string;
}
export class ItemChart extends BaseChart {
  constructor(options: ItemChartOptions) {
    super(options);
  }
  setup(stage: Stage) {
    super.setup(stage);
  }
  getComponent(sec: number) {
    const components = this.data.map((item) => {
      const id = item[this.idField];
      const value = item[this.valueField];
      return {};
    });
    const res = new Component();
    res.children = components;
    return res;
  }
}
