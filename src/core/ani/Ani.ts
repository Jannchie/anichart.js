import { Component } from "../component/Component";
import { Stage } from "../Stage";

export class Ani {
  stage?: Stage;
  component?: Component;
  children?: (Ani | Component)[];
  constructor(ani?: Ani) {
    this.stage = ani?.stage;
    this.component = ani?.component ?? new Component();
    this.children = ani?.children ?? [];
  }
  getComponent(sec: number) {
    return this.component;
  }
  setup(stage: Stage) {
    this.children.forEach((child: Component | Ani) => {
      this.stage = stage;
      child.setup(stage);
    });
  }
}
