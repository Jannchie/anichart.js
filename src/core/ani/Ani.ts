import { Component } from "../component/Component";
import { Stage } from "../Stage";

export class Ani {
  stage?: Stage;
  component?: Component = new Component();
  getComponent(sec: number) {
    return this.component;
  }
  setup(stage: Stage) {
    this.children.forEach((child: Component | Ani) => {
      this.stage = stage;
      child.setup(stage);
    });
  }
  children?: (Ani | Component)[] = [];
}
