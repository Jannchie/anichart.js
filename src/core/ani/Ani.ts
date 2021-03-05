import { Component } from "../component/Component";
import { Stage } from "../Stage";

export class Ani {
  stage: Stage | undefined;
  constructor(ani?: Ani) {
    this.stage = ani?.stage;
  }
  getComponent(sec: number): Component | null {
    return null;
  }
  setup(stage: Stage) {
    this.stage = stage;
  }
}
